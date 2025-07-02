class ExplaniumContentScript {
  constructor() {
    this.popup = null;
    this.currentSelection = null;
    this.isProcessing = false;
    this.selectionTimeout = null;
    this.settings = {
      enabled: true,
      autoExplain: true,
      longText: false
    };
    this.settingsLoaded = false;
    
    this.init();
  }
  
  async init() {
    console.log('🚀 Explanium content script initializing...');
    
    // Load settings
    await this.loadSettings();
    console.log('⚙️ Settings loaded:', this.settings);
    
    // Listen for text selection
    document.addEventListener('mouseup', this.handleSelection.bind(this));
    document.addEventListener('keyup', this.handleSelection.bind(this));
    document.addEventListener('click', this.handleClick.bind(this));
    
    // Hide popup when clicking outside (but not during processing)
    document.addEventListener('click', (e) => {
      if (this.popup && !this.popup.contains(e.target) && !this.isProcessing) {
        console.log('🖱️ Click outside popup, hiding (not processing)');
        this.hidePopup();
      } else if (this.isProcessing) {
        console.log('🖱️ Click outside popup ignored (currently processing)');
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
    
    // Check if extension is enabled
    if (!this.settings.enabled || !this.settings.autoExplain) {
      console.log('❌ Extension disabled or auto-explain off:', {
        enabled: this.settings.enabled,
        autoExplain: this.settings.autoExplain,
        settingsLoaded: this.settingsLoaded
      });
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
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
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
          }
        };
        
        console.log('📊 Selection stored:', {
          text: this.currentSelection.text.substring(0, 50) + '...',
          rect: this.currentSelection.rect
        });
        
        this.showLoadingPopup();
        this.requestExplanation(selectedText);
      } else {
        console.log('❌ Text invalid or too long/short');
        this.hidePopup();
      }
    }, 100);
  }
  
  handleClick(event) {
    // Don't hide popup if clicking on it
    if (this.popup && this.popup.contains(event.target)) {
      return;
    }
  }
  
  async requestExplanation(text) {
    if (this.isProcessing) return;
    
    console.log('🤖 Requesting explanation for:', text);
    this.isProcessing = true;
    
    try {
      // Check if extension context is still valid
      if (!chrome.runtime?.id) {
        throw new Error('Extension context invalidated - please refresh the page');
      }
      
      // Send message to background script for AI processing
      const response = await chrome.runtime.sendMessage({
        action: 'explainText',
        text: text
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
    
    this.popup.innerHTML = `
      <div class="explanium-header">
        <div class="explanium-title">
          <span class="explanium-icon">💡</span>
          <span>Explanation</span>
        </div>
        <div class="explanium-header-buttons">
          <button class="explanium-copy" onclick="window.explanium.copyExplanation()" title="Copy explanation">
            <span class="copy-icon">📋</span>
          </button>
          <button class="explanium-close" onclick="window.explanium.hidePopup()">×</button>
        </div>
      </div>
      <div class="explanium-content">
        <div class="explanium-explanation" id="explanium-explanation-text">${explanation}</div>
      </div>
    `;
    
    console.log('✅ Explanation popup updated with content');
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
    if (!this.currentSelection) return;
    
    const rect = this.currentSelection.rect;
    const popupWidth = 350;
    const popupHeight = 200; // Estimated
    
    let left = rect.left + (rect.width / 2) - (popupWidth / 2);
    let top = rect.bottom + window.scrollY + 10;
    
    // Adjust if popup goes off-screen
    if (left < 10) left = 10;
    if (left + popupWidth > window.innerWidth - 10) {
      left = window.innerWidth - popupWidth - 10;
    }
    
    // If popup would go below viewport, show above selection
    if (top + popupHeight > window.innerHeight + window.scrollY - 10) {
      top = rect.top + window.scrollY - popupHeight - 10;
    }
    
    popup.style.left = left + 'px';
    popup.style.top = top + 'px';
  }
  
  createEmergencyPopup(explanation) {
    console.log('🚨 Creating emergency popup...');
    
    const popup = this.createPopup();
    popup.innerHTML = `
      <div class="explanium-header">
        <div class="explanium-title">
          <span class="explanium-icon">💡</span>
          <span>Explanation</span>
        </div>
        <div class="explanium-header-buttons">
          <button class="explanium-copy" onclick="window.explanium.copyExplanation()" title="Copy explanation">
            <span class="copy-icon">📋</span>
          </button>
          <button class="explanium-close" onclick="window.explanium.hidePopup()">×</button>
        </div>
      </div>
      <div class="explanium-content">
        <div class="explanium-explanation" id="explanium-explanation-text">${explanation}</div>
        <div class="explanium-note" style="margin-top: 8px; font-size: 12px; color: #888; font-style: italic;">
          Note: Text selection was lost, showing explanation only.
        </div>
      </div>
    `;
    
    // Position at center of viewport
    const popupWidth = 350;
    const popupHeight = 200;
    popup.style.left = (window.innerWidth / 2 - popupWidth / 2) + 'px';
    popup.style.top = (window.innerHeight / 2 - popupHeight / 2 + window.scrollY) + 'px';
    
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
    const explanationElement = document.getElementById('explanium-explanation-text');
    if (!explanationElement) {
      console.error('❌ No explanation text found to copy');
      return;
    }

    const explanationText = explanationElement.textContent || explanationElement.innerText;
    
    // Use the Clipboard API if available
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
      document.body.appendChild(textArea);
      
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        this.showCopyConfirmation();
        console.log('✅ Explanation copied to clipboard using fallback method');
      } else {
        console.error('❌ Fallback copy method failed');
      }
    } catch (err) {
      console.error('❌ Error in fallback copy method:', err);
    }
  }

  showCopyConfirmation() {
    const copyButton = this.popup?.querySelector('.explanium-copy');
    if (copyButton) {
      const originalHTML = copyButton.innerHTML;
      copyButton.innerHTML = '<span class="copy-icon">✅</span>';
      copyButton.style.color = '#4CAF50';
      
      setTimeout(() => {
        copyButton.innerHTML = originalHTML;
        copyButton.style.color = '';
      }, 2000);
    }
  }
}

// Initialize the content script
const explanium = new ExplaniumContentScript();

// Make it available globally for debugging
window.explanium = explanium;
console.log('🌐 Explanium content script loaded and available globally'); 