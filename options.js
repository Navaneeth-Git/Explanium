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
    this.loadCacheStats();
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
      console.log('💾 Saving settings:', this.settings);
      await chrome.storage.sync.set({ explanium_settings: this.settings });
      console.log('✅ Settings saved successfully');
    } catch (error) {
      console.error('❌ Failed to save settings:', error);
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
          const oldValue = this.settings[settingKey];
          this.settings[settingKey] = !this.settings[settingKey];
          const newValue = this.settings[settingKey];
          
          console.log(`🔄 Toggle ${settingKey}: ${oldValue} → ${newValue}`);
          
          this.updateUI();
          this.saveSettings();
          
          // Show immediate feedback
          const settingName = {
            enabled: 'Extension',
            autoExplain: 'Auto-explain',
            longText: 'Long text'
          }[settingKey];
          
          this.showMessage(`${settingName} ${newValue ? 'enabled' : 'disabled'}`, 'success');
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

    // Cache management buttons
    const refreshStatsBtn = document.getElementById('refreshCacheStats');
    const clearCacheBtn = document.getElementById('clearCache');

    if (refreshStatsBtn) {
      refreshStatsBtn.addEventListener('click', () => {
        this.refreshCacheStats();
      });
    }

    if (clearCacheBtn) {
      clearCacheBtn.addEventListener('click', () => {
        this.clearCache();
      });
    }

    // Load cache stats on initialization
    this.loadCacheStats();
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
        
        // Include cache info in status if available
        const cacheInfo = response.cache ? ` | Cache: ${response.cache.cacheSize} entries, ${response.cache.hitRate} hit rate` : '';
        statusText.textContent = `✅ API key configured! ${response.model || 'Gemma-3-1b-it'} model ready for explanations.${cacheInfo}`;
        
        // Update cache stats if available
        if (response.cache) {
          this.updateCacheUI(response.cache);
        }
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

  async loadCacheStats() {
    try {
      const response = await chrome.runtime.sendMessage({ type: 'GET_CACHE_STATS' });
      this.updateCacheUI(response);
    } catch (error) {
      console.error('Failed to load cache stats:', error);
      this.updateCacheUI({
        cacheSize: 0,
        hits: 0,
        misses: 0,
        hitRate: '0%',
        apiCalls: 0
      });
    }
  }

  async refreshCacheStats() {
    const refreshBtn = document.getElementById('refreshCacheStats');
    if (!refreshBtn) return;

    const originalText = refreshBtn.textContent;
    refreshBtn.disabled = true;
    refreshBtn.textContent = 'Refreshing...';

    try {
      await this.loadCacheStats();
      this.showMessage('Cache stats refreshed', 'success');
    } catch (error) {
      this.showMessage(`Failed to refresh stats: ${error.message}`, 'error');
    } finally {
      refreshBtn.disabled = false;
      refreshBtn.textContent = originalText;
    }
  }

  async clearCache() {
    const clearBtn = document.getElementById('clearCache');
    if (!clearBtn) return;

    // Confirm before clearing
    if (!confirm('Are you sure you want to clear the cache? This will remove all cached explanations and require new API calls for future requests.')) {
      return;
    }

    const originalText = clearBtn.textContent;
    clearBtn.disabled = true;
    clearBtn.textContent = 'Clearing...';

    try {
      const response = await chrome.runtime.sendMessage({ type: 'CLEAR_CACHE' });
      
      if (response.success) {
        this.showMessage(`✅ Cache cleared! Removed ${response.clearedEntries} entries.`, 'success');
        await this.loadCacheStats(); // Refresh stats after clearing
      } else {
        this.showMessage(`❌ Failed to clear cache: ${response.error}`, 'error');
      }
    } catch (error) {
      this.showMessage(`❌ Error clearing cache: ${error.message}`, 'error');
    } finally {
      clearBtn.disabled = false;
      clearBtn.textContent = originalText;
    }
  }

  updateCacheUI(stats) {
    const cacheSize = document.getElementById('cacheSize');
    const hitRate = document.getElementById('hitRate');
    const apiCallsSaved = document.getElementById('apiCallsSaved');

    if (cacheSize) {
      cacheSize.textContent = `${stats.cacheSize || 0} / ${stats.maxEntries || 5000}`;
    }

    if (hitRate) {
      hitRate.textContent = stats.hitRate || '0%';
    }

    if (apiCallsSaved) {
      // API calls saved = cache hits (since each hit is a saved API call)
      apiCallsSaved.textContent = stats.hits || 0;
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