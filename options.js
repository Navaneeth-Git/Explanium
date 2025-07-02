class ExplaniumOptions {
  constructor() {
    this.settings = {
      enabled: true,
      autoExplain: true,
      longText: false
    };
    
    this.init();
  }
  
  async init() {
    await this.loadSettings();
    this.setupEventListeners();
    this.setupModelEventListeners();
    this.updateUI();
    this.checkAIStatus();
  }
  
  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get(['explanium_settings']);
      if (result.explanium_settings) {
        this.settings = { ...this.settings, ...result.explanium_settings };
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }
  
  async saveSettings() {
    try {
      await chrome.storage.sync.set({ explanium_settings: this.settings });
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }
  
  setupEventListeners() {
    const toggles = {
      enableToggle: 'enabled',
      autoExplainToggle: 'autoExplain',
      longTextToggle: 'longText'
    };
    
    Object.entries(toggles).forEach(([toggleId, settingKey]) => {
      const toggle = document.getElementById(toggleId);
      if (toggle) {
        toggle.addEventListener('click', () => {
          this.settings[settingKey] = !this.settings[settingKey];
          this.updateUI();
          this.saveSettings();
        });
      }
    });
  }
  
  setupModelEventListeners() {
    const downloadBtn = document.getElementById('downloadModelBtn');
    const deleteBtn = document.getElementById('deleteModelBtn');
    
    if (downloadBtn) {
      downloadBtn.addEventListener('click', async () => {
        await this.downloadModel();
      });
    }
    
    if (deleteBtn) {
      deleteBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete the downloaded model?')) {
          await this.deleteModel();
        }
      });
    }
  }
  
  async downloadModel() {
    const downloadBtn = document.getElementById('downloadModelBtn');
    const progressDiv = document.getElementById('downloadProgress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (downloadBtn) downloadBtn.disabled = true;
    if (progressDiv) progressDiv.style.display = 'block';
    if (progressText) progressText.textContent = 'Activating enhanced model...';
    
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'downloadModel'
      });
      
      if (response.success) {
        if (progressText) progressText.textContent = 'Enhanced model activated!';
        setTimeout(() => {
          if (progressDiv) progressDiv.style.display = 'none';
          this.checkAIStatus(); // Refresh status
        }, 2000);
      } else {
        if (progressText) progressText.textContent = `Error: ${response.error}`;
      }
    } catch (error) {
      console.error('Activation failed:', error);
      if (progressText) progressText.textContent = `Error: ${error.message}`;
    } finally {
      if (downloadBtn) downloadBtn.disabled = false;
    }
  }
  
  async deleteModel() {
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'deleteModel'
      });
      
      if (response.success) {
        this.checkAIStatus(); // Refresh status
      } else {
        alert(`Failed to delete model: ${response.error}`);
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert(`Error: ${error.message}`);
    }
  }
  
  updateUI() {
    // Update toggle states
    const toggles = {
      enableToggle: this.settings.enabled,
      autoExplainToggle: this.settings.autoExplain,
      longTextToggle: this.settings.longText
    };
    
    Object.entries(toggles).forEach(([toggleId, isActive]) => {
      const toggle = document.getElementById(toggleId);
      if (toggle) {
        toggle.classList.toggle('active', isActive);
      }
    });
  }
  
  async checkAIStatus() {
    const customModelStatus = document.getElementById('customModelStatus');
    const chromeAiStatus = document.getElementById('chromeAiStatus');
    const downloadBtn = document.getElementById('downloadModelBtn');
    const deleteBtn = document.getElementById('deleteModelBtn');
    
    try {
      // Get comprehensive AI status from background script
      const response = await chrome.runtime.sendMessage({
        action: 'checkAIStatus'
      });
      
      if (response) {
        // Update Custom Model Status
        if (customModelStatus) {
          if (response.customModel.available) {
            customModelStatus.innerHTML = `
              <span class="status active">Model Ready</span>
              <div style="font-size: 12px; color: #666; margin-top: 4px;">
                ${response.customModel.name} (${response.customModel.size}) - Ready for use
              </div>
            `;
            if (downloadBtn) downloadBtn.style.display = 'none';
            if (deleteBtn) deleteBtn.style.display = 'inline-block';
          } else if (response.customModel.isDownloading) {
            customModelStatus.innerHTML = `
              <span class="status inactive">Downloading...</span>
              <div style="font-size: 12px; color: #666; margin-top: 4px;">
                Progress: ${response.customModel.progress}%
              </div>
            `;
            if (downloadBtn) downloadBtn.style.display = 'none';
            if (deleteBtn) deleteBtn.style.display = 'none';
          } else if (response.customModel.hasTransformers) {
            customModelStatus.innerHTML = `
              <span class="status inactive">Not Activated</span>
              <div style="font-size: 12px; color: #666; margin-top: 4px;">
                Activate enhanced explanations with larger knowledge base
              </div>
            `;
            if (downloadBtn) downloadBtn.style.display = 'inline-block';
            if (deleteBtn) deleteBtn.style.display = 'none';
          } else {
            customModelStatus.innerHTML = `
              <span class="status active">Enhanced Model Available</span>
              <div style="font-size: 12px; color: #666; margin-top: 4px;">
                Click to activate enhanced explanations system
              </div>
            `;
            if (downloadBtn) downloadBtn.style.display = 'inline-block';
            if (deleteBtn) deleteBtn.style.display = 'none';
          }
        }
        
        // Update Chrome AI Status
        if (chromeAiStatus) {
          if (response.chromeAi.available) {
            const statusText = response.chromeAi.status === 'readily' ? 'Ready' : 'Available';
            chromeAiStatus.innerHTML = `
              <span class="status active">Chrome AI ${statusText}</span>
              <div style="font-size: 12px; color: #666; margin-top: 4px;">
                ${response.chromeAi.model} - Built into Chrome
              </div>
            `;
          } else {
            const errorText = response.chromeAi.error ? 
              `Error: ${response.chromeAi.error}` : 
              'Not supported in this browser';
            chromeAiStatus.innerHTML = `
              <span class="status inactive">Not Available</span>
              <div style="font-size: 12px; color: #666; margin-top: 4px;">
                ${errorText}
              </div>
            `;
          }
        }
        
        // Show primary source indicator
        const primarySource = response.primarySource;
        const sourceNames = {
          'custom-model': 'Custom AI Model',
          'chrome-ai': 'Chrome Built-in AI',
          'fallback': 'Fallback Dictionary'
        };
        
        console.log(`Primary AI source: ${sourceNames[primarySource]}`);
        
      }
    } catch (error) {
      console.error('Failed to check AI status:', error);
      
      // Fallback status display
      if (customModelStatus) {
        customModelStatus.innerHTML = `
          <span class="status inactive">Status Unknown</span>
          <div style="font-size: 12px; color: #666; margin-top: 4px;">
            Unable to check model status
          </div>
        `;
      }
      
      if (chromeAiStatus) {
        chromeAiStatus.innerHTML = `
          <span class="status inactive">Status Unknown</span>
          <div style="font-size: 12px; color: #666; margin-top: 4px;">
            Unable to check Chrome AI status
          </div>
        `;
      }
    }
  }
}

// Initialize options when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ExplaniumOptions();
}); 