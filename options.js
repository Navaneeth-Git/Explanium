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
        if (confirm('Remove TinyLlama model?')) {
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
    if (progressText) progressText.textContent = 'Starting...';
    if (progressFill) progressFill.style.width = '0%';
    
    // Create a progress monitoring system
    let progressInterval;
    
    try {
      console.log('🚀 [OptionsUI] Sending downloadModel command to background script...');
      const response = await chrome.runtime.sendMessage({ action: 'downloadModel' });
      console.log('📬 [OptionsUI] Received response from background script:', response);
      
      if (response.success) {
        if (progressFill) progressFill.style.width = '100%';
        if (progressText) progressText.textContent = 'Ready!';
        setTimeout(() => {
          if (progressContainer) progressContainer.style.display = 'none';
          this.checkAIStatus(); // Refresh status
        }, 2000);
      } else {
        this.showError(`Error: ${response.error || 'Activation failed. Check background logs.'}`);
        console.error('[OptionsUI] Model activation failed:', response.error);
      }
    } catch (error) {
      this.showError(`Error: ${error.message}`);
      console.error('[OptionsUI] Critical error during model activation:', error);
    } finally {
      if (downloadBtn) downloadBtn.disabled = false;
      this.isActivating = false;
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
          const sizeText = response.downloadedSize && response.totalSize ? 
            ` (${response.downloadedSize} / ${response.totalSize})` : '';
          progressText.textContent = `Loading... ${Math.round(response.progress)}%${sizeText}`;
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
        alert(`Failed to remove model: ${response.error}`);
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
        // Update TinyLlama Model Status
        if (customModelStatus) {
          if (response.tinyLlama && response.tinyLlama.available) {
            customModelStatus.textContent = `Ready to use`;
            if (downloadBtn) downloadBtn.style.display = 'none';
            if (deleteBtn) deleteBtn.style.display = 'inline-block';
          } else if (response.tinyLlama && response.tinyLlama.isDownloading) {
            const sizeText = response.tinyLlama.downloadedSize && response.tinyLlama.totalSize ? 
              ` (${response.tinyLlama.downloadedSize} / ${response.tinyLlama.totalSize})` : '';
            customModelStatus.textContent = `Loading... ${Math.round(response.tinyLlama.progress || 0)}%${sizeText}`;
            if (downloadBtn) downloadBtn.style.display = 'none';
            if (deleteBtn) deleteBtn.style.display = 'none';
          } else {
            customModelStatus.textContent = '1.1B parameter model - Click to activate';
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
            chromeAiStatus.textContent = 'Not available in this browser';
          }
        }
        
        console.log(`Primary AI source: ${response.primarySource}`);
        
      }
    } catch (error) {
      console.error('Failed to check AI status:', error);
      
      // Fallback status display
      if (customModelStatus) {
        customModelStatus.textContent = '1.1B parameter model - Click to activate';
        const downloadBtn = document.getElementById('downloadModelBtn');
        if (downloadBtn) downloadBtn.style.display = 'inline-block';
      }
      
      if (chromeAiStatus) {
        chromeAiStatus.textContent = 'Checking...';
      }
    }
  }
}

// Initialize options when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ExplaniumOptions();
  updateModelStatus();
  setInterval(updateModelStatus, 3000); // Periodically update status

  document.getElementById('activateModel').addEventListener('click', () => {
    console.log('[Options] Activate button clicked.');
    const activateButton = document.getElementById('activateModel');
    const statusDiv = document.getElementById('modelStatus');
    
    activateButton.disabled = true;
    statusDiv.textContent = 'Model is activating...';
    activateButton.textContent = 'Activating...';

    console.log('[Options] Sending ACTIVATE_MODEL message to background.');
    chrome.runtime.sendMessage({ type: 'ACTIVATE_MODEL' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('[Options] Error sending ACTIVATE_MODEL message:', chrome.runtime.lastError.message);
        statusDiv.textContent = `Error: ${chrome.runtime.lastError.message}`;
      } else {
        console.log('[Options] Received response for ACTIVATE_MODEL request:', response);
        if (response && response.error) {
          statusDiv.textContent = `Error: ${response.error}`;
        }
      }
      updateModelStatus(); // Refresh status after activation attempt
    });
  });
});

function updateModelStatus() {
  const statusDiv = document.getElementById('modelStatus');
  const activateButton = document.getElementById('activateModel');
  
  console.log('[Options] Pinging background for model status');
  chrome.runtime.sendMessage({ type: 'GET_MODEL_STATUS' }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('[Options] Error getting model status:', chrome.runtime.lastError.message);
      statusDiv.textContent = 'Error: Could not connect to the extension background. Please try reloading the extension.';
      activateButton.disabled = true;
      return;
    }

    if (!response) {
      console.error('[Options] Received empty/invalid response for GET_MODEL_STATUS');
      statusDiv.textContent = 'Status: Unknown (no response from background)';
      activateButton.disabled = false;
      activateButton.textContent = 'Activate Model';
      return;
    }
    
    console.log('[Options] Received status response:', response);

    if (response.error) {
      statusDiv.textContent = `Error: ${response.error}`;
      activateButton.disabled = false;
      activateButton.textContent = 'Activate Model';
    } else if (response.active) {
      statusDiv.textContent = 'Model is active.';
      activateButton.disabled = true;
      activateButton.textContent = 'Active';
    } else if (response.activating) {
      statusDiv.textContent = 'Model is activating... This may take a minute.';
      activateButton.disabled = true;
      activateButton.textContent = 'Activating...';
    } else if (response.downloading) {
      const { progress, downloadedSize, totalSize } = response;
      const sizeText = downloadedSize && totalSize ? `(${downloadedSize} / ${totalSize})` : '';
      statusDiv.textContent = `Downloading model... ${Math.round(progress)}% ${sizeText}`;
      activateButton.disabled = true;
      activateButton.textContent = 'Downloading...';
    } else {
      statusDiv.textContent = 'Model is not active.';
      activateButton.disabled = false;
      activateButton.textContent = 'Activate Model';
    }
  });
} 