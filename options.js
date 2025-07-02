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
    const progressContainer = document.getElementById('downloadProgress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (downloadBtn) downloadBtn.disabled = true;
    if (progressContainer) progressContainer.style.display = 'block';
    if (progressText) progressText.textContent = 'Initializing...';
    if (progressFill) progressFill.style.width = '0%';
    
    // Create a progress monitoring system
    let progressInterval;
    
    try {
      // Start monitoring progress
      progressInterval = setInterval(() => {
        this.checkDownloadProgress();
      }, 500);
      
      const response = await chrome.runtime.sendMessage({
        action: 'downloadModel'
      });
      
      clearInterval(progressInterval);
      
      if (response && response.success) {
        if (progressFill) progressFill.style.width = '100%';
        if (progressText) progressText.textContent = 'Activated successfully!';
        setTimeout(() => {
          if (progressContainer) progressContainer.style.display = 'none';
          this.checkAIStatus(); // Refresh status
        }, 2000);
      } else {
        const errorMsg = response ? response.error : 'Unknown error occurred';
        if (progressText) progressText.textContent = `Error: ${errorMsg}`;
        if (progressFill) progressFill.style.width = '0%';
      }
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Activation failed:', error);
      if (progressText) progressText.textContent = `Error: ${error.message}`;
      if (progressFill) progressFill.style.width = '0%';
    } finally {
      if (downloadBtn) downloadBtn.disabled = false;
    }
  }

  async checkDownloadProgress() {
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'getModelStatus'
      });
      
      if (response && response.isDownloading) {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (progressFill) {
          progressFill.style.width = `${response.progress}%`;
        }
        
        if (progressText) {
          progressText.textContent = `Activating... ${Math.round(response.progress)}%`;
        }
      }
    } catch (error) {
      console.error('Failed to check download progress:', error);
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
          if (response.customModel && response.customModel.available) {
            customModelStatus.textContent = `${response.customModel.name} - Active (50,000+ terms)`;
            if (downloadBtn) downloadBtn.style.display = 'none';
            if (deleteBtn) deleteBtn.style.display = 'inline-block';
          } else if (response.customModel && response.customModel.isDownloading) {
            customModelStatus.textContent = `Activating... ${Math.round(response.customModel.progress || 0)}%`;
            if (downloadBtn) downloadBtn.style.display = 'none';
            if (deleteBtn) deleteBtn.style.display = 'none';
          } else {
            customModelStatus.textContent = '200MB professional model - Click to activate';
            if (downloadBtn) downloadBtn.style.display = 'inline-block';
            if (deleteBtn) deleteBtn.style.display = 'none';
          }
        }
        
        // Update Chrome AI Status
        if (chromeAiStatus) {
          if (response.chromeAi && response.chromeAi.available) {
            const statusText = response.chromeAi.status === 'readily' ? 'Ready' : 'Available';
            chromeAiStatus.textContent = `${response.chromeAi.model || 'Gemini Nano'} - ${statusText}`;
          } else {
            chromeAiStatus.textContent = 'Not supported in this browser';
          }
        }
        
        console.log(`Primary AI source: ${response.primarySource}`);
        
      }
    } catch (error) {
      console.error('Failed to check AI status:', error);
      
      // Fallback status display
      if (customModelStatus) {
        customModelStatus.textContent = '200MB professional model - Click to activate';
        const downloadBtn = document.getElementById('downloadModelBtn');
        if (downloadBtn) downloadBtn.style.display = 'inline-block';
      }
      
      if (chromeAiStatus) {
        chromeAiStatus.textContent = 'Status unknown';
      }
    }
  }
}

// Initialize options when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ExplaniumOptions();
}); 