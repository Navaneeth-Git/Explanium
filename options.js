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
    this.updateUI();
    this.checkStatus();
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
    // Toggle switches
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

    // API key management
    const saveApiKeyBtn = document.getElementById('saveApiKey');
    const apiKeyInput = document.getElementById('apiKey');

    if (saveApiKeyBtn) {
      saveApiKeyBtn.addEventListener('click', () => {
        this.saveApiKey();
      });
    }

    if (apiKeyInput) {
      apiKeyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.saveApiKey();
        }
      });
    }

    // Load existing API key
    this.loadApiKey();
  }

  async loadApiKey() {
    try {
      const result = await chrome.storage.sync.get(['gemini_api_key']);
      const apiKeyInput = document.getElementById('apiKey');
      if (result.gemini_api_key && apiKeyInput) {
        apiKeyInput.value = result.gemini_api_key;
      }
    } catch (error) {
      console.error('Failed to load API key:', error);
    }
  }

  async saveApiKey() {
    const apiKeyInput = document.getElementById('apiKey');
    const saveBtn = document.getElementById('saveApiKey');
    
    if (!apiKeyInput || !saveBtn) return;

    const apiKey = apiKeyInput.value.trim();
    
    if (!apiKey) {
      this.showMessage('Please enter an API key', 'error');
      return;
    }

    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'SET_API_KEY',
        apiKey: apiKey
      });

      if (response.success) {
        this.showMessage('✅ API key saved successfully!', 'success');
        this.checkStatus();
      } else {
        this.showMessage(`❌ Failed to save API key: ${response.error}`, 'error');
      }
    } catch (error) {
      this.showMessage(`❌ Error: ${error.message}`, 'error');
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save API Key';
    }
  }

  async checkStatus() {
    try {
      const response = await chrome.runtime.sendMessage({ type: 'GET_STATUS' });
      const statusDiv = document.getElementById('connectionStatus');
      const statusText = document.getElementById('statusText');
      
      if (!statusDiv || !statusText) return;

      if (response.hasApiKey) {
        statusDiv.className = 'status success';
        statusText.textContent = `✅ API key configured! ${response.model || 'Gemma-3-1b-it'} model ready for explanations.`;
      } else {
        statusDiv.className = 'status error';
        statusText.textContent = '❌ No API key configured. Please add your Google Gemini API key above.';
      }
    } catch (error) {
      console.error('Failed to check status:', error);
      const statusDiv = document.getElementById('connectionStatus');
      const statusText = document.getElementById('statusText');
      
      if (statusDiv && statusText) {
        statusDiv.className = 'status error';
        statusText.textContent = '❌ Unable to check status. Please reload the extension.';
      }
    }
  }

  showMessage(message, type) {
    const messageDiv = document.getElementById('statusMessage');
    if (!messageDiv) return;

    messageDiv.textContent = message;
    messageDiv.className = `status ${type}`;
    messageDiv.classList.remove('hidden');

    // Auto-hide after 5 seconds
    setTimeout(() => {
      messageDiv.classList.add('hidden');
    }, 5000);
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
        if (isActive) {
          toggle.classList.add('active');
        } else {
          toggle.classList.remove('active');
        }
      }
    });
  }
}

// Initialize options when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ExplaniumOptions();
}); 