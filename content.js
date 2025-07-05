class ExplaniumContentScript {
  constructor() {
    this.popup = null;
    this.currentSelection = null;
    this.isProcessing = false;
    this.selectionTimeout = null;
    this.lastSelectionTime = 0;
    this.selectionThreshold = 300; // Minimum time between selections
    this.settingsLoaded = false;
    this.settings = {
      enabled: true,
      autoExplain: true,
      longText: false
    };
    
    this.init();
  }
  
  async init() {
    console.log('🚀 Explanium content script initializing...');
    
    // Load settings
    await this.loadSettings();
    console.log('⚙️ Settings loaded:', this.settings);
    
    this.setupEventListeners();
    this.setupMessageListener();
    this.setupStorageListener(); // Add storage listener for settings changes
    
    // Hide popup when clicking outside (but not during processing)
    document.addEventListener('click', (e) => {
      // Check if clicked element is part of the popup
      if (this.popup && (this.popup.contains(e.target) || e.target.closest('.explanium-popup'))) {
        console.log('🖱️ Click inside popup, ignoring');
        return;
      }
      
      if (this.popup && !this.isProcessing) {
        console.log('🖱️ Click outside popup, hiding (not processing)');
        this.hidePopup();
      } else if (this.isProcessing) {
        console.log('🖱️ Click outside popup ignored (currently processing)');
      }
    });
    
    // Hide popup when clicking outside (but not during processing)
    document.addEventListener('mousedown', (e) => {
      // Check if clicked element is part of the popup
      if (this.popup && (this.popup.contains(e.target) || e.target.closest('.explanium-popup'))) {
        console.log('🖱️ Mousedown inside popup, ignoring');
        return;
      }
      
      if (this.popup && !this.isProcessing) {
        console.log('🖱️ Mousedown outside popup, hiding (not processing)');
        this.hidePopup();
      }
    });
    
    // Listen for scroll to hide popup (but not during processing)
    document.addEventListener('scroll', () => {
      if (this.popup && !this.isProcessing) {
        console.log('📜 Scroll detected, hiding popup (not processing)');
        this.hidePopup();
      } else if (this.isProcessing) {
        console.log('📜 Scroll ignored (currently processing)');
      }
    });
    
    console.log('✅ Explanium content script initialized successfully');
  }
  
  setupStorageListener() {
    // Listen for storage changes to update settings in real-time
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'sync' && changes.explanium_settings) {
        console.log('📋 Settings changed, updating...', changes.explanium_settings.newValue);
        this.settings = { ...this.settings, ...changes.explanium_settings.newValue };
        
        // If extension is disabled, hide any existing popup
        if (!this.settings.enabled && this.popup) {
          console.log('🚫 Extension disabled, hiding popup');
          this.hidePopup();
        }
        
        console.log('📋 Settings updated:', this.settings);
      }
    });
  }
  
  setupMessageListener() {
    // Listen for messages from background script (context menu)
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log('[Content] Received message:', request.type);
      
      if (request.type === 'CONTEXT_MENU_EXPLAIN' && request.text) {
        console.log('[Content] Context menu explain request:', request.text.substring(0, 50) + '...');
        
        // Check if extension is enabled for context menu
        if (!this.settings.enabled) {
          console.log('❌ Extension disabled, ignoring context menu request');
          sendResponse({ success: false, error: 'Extension is disabled' });
          return;
        }
        
        // Try to get actual selection position, fallback to mouse position
        const selection = window.getSelection();
        let rect;
        
        if (selection.rangeCount > 0) {
          // Use actual selection if available
          const range = selection.getRangeAt(0);
          const selectionRect = range.getBoundingClientRect();
          rect = {
            left: selectionRect.left,
            top: selectionRect.top,
            right: selectionRect.right,
            bottom: selectionRect.bottom,
            width: selectionRect.width,
            height: selectionRect.height
          };
        } else {
          // Fallback to center of viewport if no selection
          rect = {
            left: window.innerWidth / 2 - 100,
            top: window.innerHeight / 2 - 20,
            right: window.innerWidth / 2 + 100,
            bottom: window.innerHeight / 2 + 20,
            width: 200,
            height: 40
          };
        }
        
        // Create selection object for context menu
        this.currentSelection = {
          text: request.text,
          rect: rect,
          timestamp: Date.now(),
          fromContextMenu: true
        };
        
        this.showLoadingPopup();
        this.requestExplanation(request.text);
        
        sendResponse({ success: true });
      }
      
      return false;
    });
  }
  
  setupEventListeners() {
    // Use mouseup instead of selectionchange for better reliability
    document.addEventListener('mouseup', (event) => {
      // Small delay to ensure selection is complete
      setTimeout(() => this.handleSelection(event), 50);
    });
    
    // Also listen for keyboard selection (shift+arrow keys)
    document.addEventListener('keyup', (event) => {
      if (event.shiftKey || event.key === 'ArrowLeft' || event.key === 'ArrowRight' || 
          event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        setTimeout(() => this.handleSelection(event), 50);
      }
    });
    
    // Hide popup when clicking outside
    document.addEventListener('click', (event) => this.handleClick(event));
    
    // Hide popup on escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.popup) {
        this.hidePopup();
      }
    });
  }
  
  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get(['explanium_settings']);
      if (result.explanium_settings) {
        this.settings = { ...this.settings, ...result.explanium_settings };
        console.log('📋 Loaded settings from storage:', result.explanium_settings);
      } else {
        console.log('📋 No stored settings found, using defaults');
      }
      console.log('📋 Final settings:', this.settings);
      this.settingsLoaded = true;
    } catch (error) {
      console.error('❌ Failed to load settings:', error);
      // Use default settings if loading fails
      console.log('📋 Using default settings:', this.settings);
      this.settingsLoaded = true;
    }
  }
  
  handleSelection(event) {
    console.log('👆 Text selection event triggered');
    
    // Ensure settings are loaded
    if (!this.settingsLoaded) {
      console.log('⏳ Settings not loaded yet, skipping...');
      return;
    }
    
    // Check if extension is enabled - this should now always be current due to storage listener
    if (!this.settings.enabled) {
      console.log('❌ Extension is disabled, skipping selection', {
        enabled: this.settings.enabled,
        autoExplain: this.settings.autoExplain,
        longText: this.settings.longText
      });
      return;
    }
    
    // Check if auto-explain is enabled
    if (!this.settings.autoExplain) {
      console.log('❌ Auto-explain is disabled, skipping selection', {
        enabled: this.settings.enabled,
        autoExplain: this.settings.autoExplain,
        longText: this.settings.longText
      });
      return;
    }
    
    console.log('✅ Settings check passed:', {
      enabled: this.settings.enabled,
      autoExplain: this.settings.autoExplain,
      longText: this.settings.longText
    });
    
    // Throttle selection handling to prevent duplicate triggers
    const now = Date.now();
    if (now - this.lastSelectionTime < this.selectionThreshold) {
      console.log('⏳ Selection throttled, too soon after last selection');
      return;
    }
    
    // Clear any existing timeout
    if (this.selectionTimeout) {
      clearTimeout(this.selectionTimeout);
    }
    
    // Add small delay to ensure selection is complete
    this.selectionTimeout = setTimeout(() => {
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();
      
      console.log('📝 Selected text:', selectedText);
      console.log('📏 Text length:', selectedText.length);
      
      if (selectedText && selectedText.length > 0 && selectedText.length < 5000) {
        // Allow much longer text - up to 5000 characters
        // Check if user wants to limit very long texts
        if (!this.settings.longText && selectedText.length > 200) {
          console.log('❌ Text longer than 200 chars and longText setting disabled');
          return;
        }
        
        console.log('✅ Text valid, creating popup...');
        
        // Store selection data before it gets cleared
        let rect;
        try {
          const range = selection.getRangeAt(0);
          rect = range.getBoundingClientRect();
          
          // IMPORTANT: Clear any previous selection to ensure fresh processing
          this.currentSelection = null;
          
          this.currentSelection = {
            text: selectedText,
            range: range.cloneRange(), // Clone to prevent clearing
            rect: {
              left: rect.left,
              top: rect.top,
              right: rect.right,
              bottom: rect.bottom,
              width: rect.width,
              height: rect.height
            },
            timestamp: Date.now(), // Add timestamp to ensure uniqueness
            fromContextMenu: false
          };
          
          console.log('📊 Selection stored with timestamp:', {
            text: this.currentSelection.text.substring(0, 50) + '...',
            rect: this.currentSelection.rect,
            timestamp: this.currentSelection.timestamp,
            scrollY: window.scrollY,
            scrollX: window.scrollX,
            viewportHeight: window.innerHeight,
            viewportWidth: window.innerWidth
          });
          
          this.lastSelectionTime = now;
          this.showLoadingPopup();
          this.requestExplanation(selectedText);
        } catch (error) {
          console.error('❌ Error getting selection range:', error);
          // Fallback to mouse position if selection range fails
          const mouseX = event.clientX || window.innerWidth / 2;
          const mouseY = event.clientY || window.innerHeight / 2;
          
          // Create fallback selection with proper positioning
          this.currentSelection = {
            text: selectedText,
            rect: {
              left: mouseX,
              top: mouseY,
              right: mouseX + 200,
              bottom: mouseY + 20,
              width: 200,
              height: 20
            },
            timestamp: Date.now(),
            fromContextMenu: false
          };
          
          console.log('📊 Fallback selection created:', {
            text: this.currentSelection.text.substring(0, 50) + '...',
            rect: this.currentSelection.rect,
            mousePosition: { x: mouseX, y: mouseY },
            scrollY: window.scrollY,
            scrollX: window.scrollX
          });
          
          this.lastSelectionTime = now;
          this.showLoadingPopup();
          this.requestExplanation(selectedText);
        }
      } else {
        console.log('❌ Text invalid or too long/short');
        this.hidePopup();
      }
    }, 150); // Increased delay for better reliability
  }
  
  handleClick(event) {
    // Don't hide popup if clicking on it or its children
    if (this.popup && (this.popup.contains(event.target) || event.target.closest('.explanium-popup'))) {
      console.log('🖱️ Click inside popup, preventing hide');
      event.stopPropagation();
      return;
    }
  }
  
  async requestExplanation(text) {
    if (this.isProcessing) {
      console.log('🔄 Already processing, ignoring duplicate request');
      return;
    }
    
    console.log('🤖 Requesting explanation for:', text);
    console.log('📊 Request details:', {
      textLength: text.length,
      timestamp: Date.now(),
      selectionTimestamp: this.currentSelection?.timestamp
    });
    
    this.isProcessing = true;
    
    try {
      // Check if extension context is still valid
      if (!chrome.runtime?.id) {
        throw new Error('Extension context invalidated - please refresh the page');
      }
      
      // Send message to background script for AI processing with the correct
      // field name (type) that AIModelManager expects.
      const response = await chrome.runtime.sendMessage({
        type: 'EXPLAIN_TEXT',
        text: text,
        requestId: Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        timestamp: Date.now()
      });
      
      console.log('📡 Background response:', response);
      
      if (response && response.success) {
        console.log('✅ Showing explanation:', response.explanation);
        this.showExplanation(response.explanation);
      } else {
        console.error('❌ Failed to get explanation:', response);
        this.showError(response?.error || 'Failed to get explanation');
      }
    } catch (error) {
      console.error('❌ Explanium error:', error);
      
      // Handle specific extension context errors
      if (error.message.includes('Extension context invalidated') || 
          error.message.includes('message port closed') ||
          error.message.includes('receiving end does not exist')) {
        this.showError('Extension was reloaded. Please refresh this page to continue using Explanium.');
      } else {
        this.showError('Extension error: ' + error.message);
      }
    } finally {
      this.isProcessing = false;
    }
  }
  
  showLoadingPopup() {
    console.log('🔄 Creating loading popup...');
    console.log('🔍 Current selection state:', {
      hasSelection: !!this.currentSelection,
      text: this.currentSelection?.text?.substring(0, 50) + '...',
      rect: this.currentSelection?.rect
    });
    
    if (!this.currentSelection) {
      console.error('❌ No current selection for popup');
      return;
    }
    
    // Store selection before hiding popup (hidePopup clears selection)
    const savedSelection = this.currentSelection;
    this.hidePopup();
    this.currentSelection = savedSelection; // Restore selection after hiding old popup
    
    const popup = this.createPopup();
    popup.innerHTML = `
      <div class="explanium-header">
        <div class="explanium-loading">
          <div class="explanium-spinner"></div>
          <span>Analyzing...</span>
        </div>
      </div>
      <div class="explanium-content">
      </div>
    `;
    
    this.positionPopup(popup);
    document.body.appendChild(popup);
    this.popup = popup;
    
    console.log('✅ Loading popup created and positioned');
  }
  
  showExplanation(explanation) {
    console.log('💡 Showing explanation popup...');
    console.log('🔍 Popup/selection state before showing:', {
      hasPopup: !!this.popup,
      hasSelection: !!this.currentSelection,
      isProcessing: this.isProcessing
    });
    
    // If popup was removed but we still have selection, recreate it
    if (!this.popup && this.currentSelection) {
      console.log('🔄 Popup missing but selection exists, recreating...');
      this.showLoadingPopup();
    }
    
    // If we still don't have popup or selection, try to recover
    if (!this.popup || !this.currentSelection) {
      console.error('❌ No popup or selection for explanation', {
        hasPopup: !!this.popup,
        hasSelection: !!this.currentSelection
      });
      
      // Last resort: create a simple popup at cursor position if we have explanation
      if (explanation) {
        console.log('🆘 Creating emergency popup at cursor position...');
        this.createEmergencyPopup(explanation);
      }
      return;
    }
    
    // Store the explanation text for copy functionality
    this.lastExplanation = explanation;
    
    this.popup.innerHTML = `
      <div class="explanium-header">
        <div class="explanium-title">
          <span class="explanium-icon">●</span>
          <span>Explanation</span>
          <svg class="ai-icon" viewBox="0 0 24 24" width="14" height="14">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
            <circle cx="12" cy="12" r="1" fill="currentColor"/>
          </svg>
        </div>
        <div class="explanium-header-buttons">
          <button class="explanium-copy" title="Copy explanation">
            <span class="copy-icon">⧉</span>
          </button>
          <button class="explanium-close">✕</button>
        </div>
      </div>
      <div class="explanium-content">
        <div class="explanium-explanation" id="explanium-explanation-text">${this.parseMarkdown(explanation)}</div>
      </div>
    `;
    
    // Add event listeners directly to the buttons with proper event handling
    const copyButton = this.popup.querySelector('.explanium-copy');
    const closeButton = this.popup.querySelector('.explanium-close');
    
    if (copyButton) {
      copyButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        console.log('📋 Copy button clicked');
        this.copyExplanation();
      });
      
      copyButton.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      });
    }
    
    if (closeButton) {
      closeButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        console.log('✕ Close button clicked');
        this.hidePopup();
      });
      
      closeButton.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      });
    }
    
    console.log('✅ Explanation popup updated with content and event listeners');
  }
  
  showError(error) {
    if (!this.popup) return;
    
    this.popup.innerHTML = `
      <div class="explanium-header">
        <div class="explanium-title explanium-error">
          <span class="explanium-icon">⚠️</span>
          <span>Error</span>
        </div>
        <button class="explanium-close" onclick="window.explanium.hidePopup()">×</button>
      </div>
      <div class="explanium-content">
        <div class="explanium-error-message">${error}</div>
      </div>
    `;
  }
  
  createPopup() {
    const popup = document.createElement('div');
    popup.className = 'explanium-popup';
    popup.id = 'explanium-popup-' + Date.now();
    return popup;
  }
  
  positionPopup(popup) {
    if (!this.currentSelection) {
      console.error('❌ No current selection for positioning');
      return;
    }
    
    const rect = this.currentSelection.rect;
    const popupWidth = 350;
    const popupHeight = 200; // Estimated height
    const margin = 10;
    
    // Calculate absolute positions (viewport coordinates + scroll offset)
    const absoluteLeft = rect.left + window.scrollX;
    const absoluteTop = rect.top + window.scrollY;
    const absoluteBottom = rect.bottom + window.scrollY;
    
    // Calculate initial position - center horizontally below selection
    let left = absoluteLeft + (rect.width / 2) - (popupWidth / 2);
    let top = absoluteBottom + margin;
    
    // Ensure popup doesn't go off the left edge
    if (left < window.scrollX + margin) {
      left = window.scrollX + margin;
    }
    
    // Ensure popup doesn't go off the right edge
    if (left + popupWidth > window.scrollX + window.innerWidth - margin) {
      left = window.scrollX + window.innerWidth - popupWidth - margin;
    }
    
    // Check if popup would go below the current viewport
    const viewportBottom = window.scrollY + window.innerHeight;
    if (top + popupHeight > viewportBottom - margin) {
      // Show it above the selection
      top = absoluteTop - popupHeight - margin;
      
      // If it still doesn't fit above the viewport, position it at the top of the viewport
      if (top < window.scrollY + margin) {
        top = window.scrollY + margin;
      }
    }
    
    // Final check: ensure popup stays within viewport vertically
    if (top < window.scrollY + margin) {
      top = window.scrollY + margin;
    }
    
    // Set absolute positioning
    popup.style.position = 'absolute';
    popup.style.left = left + 'px';
    popup.style.top = top + 'px';
    popup.style.zIndex = '2147483647'; // Maximum z-index
    
    console.log('📍 Popup positioned at:', {
      left: left,
      top: top,
      selectionRect: rect,
      absolutePositions: {
        absoluteLeft,
        absoluteTop,
        absoluteBottom
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        scrollX: window.scrollX,
        scrollY: window.scrollY
      },
      calculated: {
        viewportBottom,
        willFitBelow: (top + popupHeight <= viewportBottom - margin)
      }
    });
  }
  
  createEmergencyPopup(explanation) {
    console.log('🚨 Creating emergency popup...');
    
    // Store the explanation text for copy functionality
    this.lastExplanation = explanation;
    
    const popup = this.createPopup();
    popup.innerHTML = `
      <div class="explanium-header">
        <div class="explanium-title">
          <span class="explanium-icon">●</span>
          <span>Explanation</span>
        </div>
        <div class="explanium-header-buttons">
          <button class="explanium-copy" title="Copy explanation">
            <span class="copy-icon">⧉</span>
          </button>
          <button class="explanium-close">✕</button>
        </div>
      </div>
      <div class="explanium-content">
        <div class="explanium-explanation" id="explanium-explanation-text">${this.parseMarkdown(explanation)}</div>
        <div class="explanium-note" style="margin-top: 8px; font-size: 12px; color: #888; font-style: italic;">
          Note: Text selection was lost, showing explanation only.
        </div>
      </div>
    `;
    
    // Add event listeners directly to the buttons with proper event handling
    const copyButton = popup.querySelector('.explanium-copy');
    const closeButton = popup.querySelector('.explanium-close');
    
    if (copyButton) {
      copyButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        console.log('📋 Copy button clicked (emergency)');
        this.copyExplanation();
      });
      
      copyButton.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      });
    }
    
    if (closeButton) {
      closeButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        console.log('✕ Close button clicked (emergency)');
        this.hidePopup();
      });
      
      closeButton.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      });
    }
    
    // Position at top-right corner of viewport to avoid blocking content
    const popupWidth = 350;
    const margin = 20;
    popup.style.left = (window.innerWidth - popupWidth - margin) + 'px';
    popup.style.top = (window.scrollY + margin) + 'px';
    
    document.body.appendChild(popup);
    this.popup = popup;
    
    console.log('✅ Emergency popup created and centered');
  }
  
  hidePopup() {
    console.log('🚫 Hiding popup...', {
      hadPopup: !!this.popup,
      hadSelection: !!this.currentSelection,
      isProcessing: this.isProcessing
    });
    
    if (this.popup) {
      this.popup.remove();
      this.popup = null;
    }
    this.currentSelection = null;
  }

  copyExplanation() {
    console.log('📋 Copy explanation requested');
    
    // First try to get text from the stored explanation
    let explanationText = this.lastExplanation;
    
    // If no stored explanation, try to get from the DOM element
    if (!explanationText) {
    const explanationElement = document.getElementById('explanium-explanation-text');
      if (explanationElement) {
        explanationText = explanationElement.textContent || explanationElement.innerText;
      }
    }
    
    // If still no text, try to get from the popup content
    if (!explanationText && this.popup) {
      const explanationElement = this.popup.querySelector('.explanium-explanation');
      if (explanationElement) {
        explanationText = explanationElement.textContent || explanationElement.innerText;
      }
    }
    
    if (!explanationText) {
      console.error('❌ No explanation text found to copy');
      this.showCopyError();
      return;
    }

    console.log('📝 Copying text:', explanationText.substring(0, 100) + '...');
    
    // Use the modern Clipboard API if available
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(explanationText).then(() => {
        this.showCopyConfirmation();
        console.log('✅ Explanation copied to clipboard using Clipboard API');
      }).catch(err => {
        console.error('❌ Failed to copy using Clipboard API:', err);
        this.fallbackCopy(explanationText);
      });
    } else {
      // Fallback method for older browsers or insecure contexts
      this.fallbackCopy(explanationText);
    }
  }

  fallbackCopy(text) {
    try {
      // Create a temporary textarea element
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      textArea.style.width = '1px';
      textArea.style.height = '1px';
      textArea.style.opacity = '0';
      textArea.style.pointerEvents = 'none';
      document.body.appendChild(textArea);
      
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, text.length);
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        this.showCopyConfirmation();
        console.log('✅ Explanation copied to clipboard using fallback method');
      } else {
        console.error('❌ Fallback copy method failed');
        this.showCopyError();
      }
    } catch (err) {
      console.error('❌ Error in fallback copy method:', err);
      this.showCopyError();
    }
  }

  showCopyConfirmation() {
    const copyButton = this.popup?.querySelector('.explanium-copy');
    if (copyButton) {
      const originalHTML = copyButton.innerHTML;
      copyButton.innerHTML = '<span class="copy-icon">✅</span>';
      copyButton.style.color = '#4CAF50';
      
      setTimeout(() => {
        if (copyButton.parentNode) { // Check if button still exists
          copyButton.innerHTML = originalHTML;
          copyButton.style.color = '';
        }
      }, 2000);
    }
  }

  showCopyError() {
    const copyButton = this.popup?.querySelector('.explanium-copy');
    if (copyButton) {
      const originalHTML = copyButton.innerHTML;
      copyButton.innerHTML = '<span class="copy-icon">❌</span>';
      copyButton.style.color = '#f44336';
      
      setTimeout(() => {
        if (copyButton.parentNode) { // Check if button still exists
        copyButton.innerHTML = originalHTML;
        copyButton.style.color = '';
        }
      }, 2000);
    }
  }

  parseMarkdown(text) {
    if (!text) return '';
    
    // Escape HTML first to prevent XSS
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
    
    // Parse markdown syntax
    html = html
      // Headers
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<strong>$1</strong>')
      
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      
      // Underline (using HTML-style for better support)
      .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
      
      // Code inline
      .replace(/`(.*?)`/g, '<code>$1</code>')
      
      // Blockquotes
      .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
      
      // Line breaks
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
    
    // Wrap in paragraph tags if not already wrapped
    if (!html.includes('<h1>') && !html.includes('<h2>') && !html.includes('<h3>') && !html.includes('<p>')) {
      html = '<p>' + html + '</p>';
    }
    
    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, '');
    
    return html;
  }
}

// Initialize the content script
const explanium = new ExplaniumContentScript();

// Make it available globally for debugging
window.explanium = explanium;
console.log('🌐 Explanium content script loaded and available globally'); 