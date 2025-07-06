console.log('[Background] Script start.');

// Google GenAI configuration
const GENAI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemma-3-1b-it:generateContent';

// Cache configuration
const CACHE_CONFIG = {
    maxEntries: 5000,             // Maximum number of cached explanations
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    cleanupInterval: 24 * 60 * 60 * 1000, // Clean up every 24 hours
    keyPrefix: 'explanium_cache_'
};

class ExplanationCache {
    constructor() {
        this.stats = {
            hits: 0,
            misses: 0,
            apiCalls: 0,
            cacheSize: 0
        };
        this.initCache();
    }

    async initCache() {
        try {
            await this.loadStats();
            await this.cleanupExpiredEntries();
            console.log('[Cache] Cache initialized with', this.stats.cacheSize, 'entries');
        } catch (error) {
            console.error('[Cache] Failed to initialize cache:', error);
        }
    }

    // Create a consistent hash for text to use as cache key
    createCacheKey(text) {
        // Normalize text by removing extra whitespace and converting to lowercase
        const normalizedText = text.trim().toLowerCase().replace(/\s+/g, ' ');
        
        // Simple hash function for the normalized text
        let hash = 0;
        for (let i = 0; i < normalizedText.length; i++) {
            const char = normalizedText.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        
        // Create a more readable hash by including length and first few characters
        const shortText = normalizedText.substring(0, 20).replace(/[^a-z0-9]/g, '');
        return `${CACHE_CONFIG.keyPrefix}${Math.abs(hash)}_${normalizedText.length}_${shortText}`;
    }

    async getCachedExplanation(text) {
        try {
            const cacheKey = this.createCacheKey(text);
            const result = await chrome.storage.local.get([cacheKey]);
            
            if (result[cacheKey]) {
                const cached = result[cacheKey];
                
                // Check if cached entry is still valid
                if (Date.now() - cached.timestamp < CACHE_CONFIG.maxAge) {
                    this.stats.hits++;
                    await this.updateStats();
                    
                    console.log('[Cache] HIT for text:', text.substring(0, 50) + '...');
                    console.log('[Cache] Cache stats - Hits:', this.stats.hits, 'Misses:', this.stats.misses, 'Hit rate:', (this.stats.hits / (this.stats.hits + this.stats.misses) * 100).toFixed(1) + '%');
                    
                    return {
                        success: true,
                        explanation: cached.explanation,
                        fromCache: true,
                        cacheTimestamp: cached.timestamp
                    };
                } else {
                    // Entry expired, remove it
                    await chrome.storage.local.remove([cacheKey]);
                    this.stats.cacheSize = Math.max(0, this.stats.cacheSize - 1);
                    console.log('[Cache] Expired entry removed for text:', text.substring(0, 50) + '...');
                }
            }
            
            this.stats.misses++;
            await this.updateStats();
            
            console.log('[Cache] MISS for text:', text.substring(0, 50) + '...');
            return null;
            
        } catch (error) {
            console.error('[Cache] Error getting cached explanation:', error);
            return null;
        }
    }

    async cacheExplanation(text, explanation) {
        try {
            const cacheKey = this.createCacheKey(text);
            const cacheEntry = {
                text: text,
                explanation: explanation,
                timestamp: Date.now(),
                accessCount: 1
            };
            
            // Check if we need to make room in cache
            if (this.stats.cacheSize >= CACHE_CONFIG.maxEntries) {
                await this.cleanupOldEntries();
            }
            
            await chrome.storage.local.set({ [cacheKey]: cacheEntry });
            this.stats.cacheSize++;
            await this.updateStats();
            
            console.log('[Cache] Cached explanation for text:', text.substring(0, 50) + '...');
            console.log('[Cache] Cache size:', this.stats.cacheSize, '/', CACHE_CONFIG.maxEntries);
            
        } catch (error) {
            console.error('[Cache] Error caching explanation:', error);
        }
    }

    async cleanupExpiredEntries() {
        try {
            const allData = await chrome.storage.local.get();
            const currentTime = Date.now();
            const keysToRemove = [];
            
            for (const key in allData) {
                if (key.startsWith(CACHE_CONFIG.keyPrefix)) {
                    const entry = allData[key];
                    if (entry.timestamp && currentTime - entry.timestamp > CACHE_CONFIG.maxAge) {
                        keysToRemove.push(key);
                    }
                }
            }
            
            if (keysToRemove.length > 0) {
                await chrome.storage.local.remove(keysToRemove);
                this.stats.cacheSize = Math.max(0, this.stats.cacheSize - keysToRemove.length);
                console.log('[Cache] Cleaned up', keysToRemove.length, 'expired entries');
            }
            
        } catch (error) {
            console.error('[Cache] Error cleaning up expired entries:', error);
        }
    }

    async cleanupOldEntries() {
        try {
            const allData = await chrome.storage.local.get();
            const cacheEntries = [];
            
            // Collect all cache entries with their keys
            for (const key in allData) {
                if (key.startsWith(CACHE_CONFIG.keyPrefix)) {
                    cacheEntries.push({
                        key: key,
                        timestamp: allData[key].timestamp || 0,
                        accessCount: allData[key].accessCount || 0
                    });
                }
            }
            
            // Sort by timestamp (oldest first) and remove 10% of entries
            cacheEntries.sort((a, b) => a.timestamp - b.timestamp);
            const entriesToRemove = Math.ceil(cacheEntries.length * 0.1);
            const keysToRemove = cacheEntries.slice(0, entriesToRemove).map(entry => entry.key);
            
            if (keysToRemove.length > 0) {
                await chrome.storage.local.remove(keysToRemove);
                this.stats.cacheSize = Math.max(0, this.stats.cacheSize - keysToRemove.length);
                console.log('[Cache] Cleaned up', keysToRemove.length, 'old entries to make room');
            }
            
        } catch (error) {
            console.error('[Cache] Error cleaning up old entries:', error);
        }
    }

    async loadStats() {
        try {
            const result = await chrome.storage.local.get(['explanium_cache_stats']);
            if (result.explanium_cache_stats) {
                this.stats = { ...this.stats, ...result.explanium_cache_stats };
            }
            
            // Count actual cache entries to ensure accurate cache size
            const allData = await chrome.storage.local.get();
            let actualCacheSize = 0;
            for (const key in allData) {
                if (key.startsWith(CACHE_CONFIG.keyPrefix)) {
                    actualCacheSize++;
                }
            }
            this.stats.cacheSize = actualCacheSize;
            
        } catch (error) {
            console.error('[Cache] Error loading stats:', error);
        }
    }

    async updateStats() {
        try {
            await chrome.storage.local.set({ explanium_cache_stats: this.stats });
        } catch (error) {
            console.error('[Cache] Error updating stats:', error);
        }
    }

    async clearCache() {
        try {
            const allData = await chrome.storage.local.get();
            const keysToRemove = [];
            
            for (const key in allData) {
                if (key.startsWith(CACHE_CONFIG.keyPrefix)) {
                    keysToRemove.push(key);
                }
            }
            
            if (keysToRemove.length > 0) {
                await chrome.storage.local.remove(keysToRemove);
                this.stats.cacheSize = 0;
                await this.updateStats();
                console.log('[Cache] Cleared', keysToRemove.length, 'cache entries');
            }
            
            return { success: true, clearedEntries: keysToRemove.length };
            
        } catch (error) {
            console.error('[Cache] Error clearing cache:', error);
            return { success: false, error: error.message };
        }
    }

    getCacheStats() {
        const hitRate = this.stats.hits + this.stats.misses > 0 
            ? (this.stats.hits / (this.stats.hits + this.stats.misses) * 100).toFixed(1)
            : 0;
        
        return {
            ...this.stats,
            hitRate: hitRate + '%',
            maxEntries: CACHE_CONFIG.maxEntries,
            maxAge: CACHE_CONFIG.maxAge
        };
    }
}

class GemmaExplainer {
    constructor() {
        this.apiKey = null;
        this.cache = new ExplanationCache();
        this.loadApiKey();
    }

    async loadApiKey() {
        try {
            const result = await chrome.storage.sync.get(['gemini_api_key']);
            this.apiKey = result.gemini_api_key;
            console.log('[Background] API key loaded:', this.apiKey ? 'Present' : 'Missing');
        } catch (error) {
            console.error('[Background] Failed to load API key:', error);
        }
    }

    async saveApiKey(apiKey) {
        try {
            await chrome.storage.sync.set({ gemini_api_key: apiKey });
            this.apiKey = apiKey;
            console.log('[Background] API key saved successfully');
            return { success: true };
        } catch (error) {
            console.error('[Background] Failed to save API key:', error);
            return { success: false, error: error.message };
        }
    }

    async explainText(text) {
        if (!this.apiKey) {
            return { 
                success: false, 
                error: 'API key not configured. Please set your Gemini API key in the extension options.' 
            };
        }

        if (!text || text.trim().length === 0) {
            return { 
                success: false, 
                error: 'No text provided for explanation.' 
            };
        }

        // Check cache first
        const cachedResult = await this.cache.getCachedExplanation(text);
        if (cachedResult) {
            return cachedResult;
        }

        // Proceed with API call if not in cache
        this.cache.stats.apiCalls++;
        await this.cache.updateStats();

        // Request body following the conversation structure from Python code
        const requestBody = {
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: "what is the meaning of loop, summarize it"
                        }
                    ]
                },
                {
                    role: "model",
                    parts: [
                        {
                            text: "Okay, let's break down the meaning of \"loop\" – it's a surprisingly versatile concept! Here's a summary and a deeper look:\n\n**What is a Loop?**\n\nAt its most basic, a loop is a **repetition of a block of code.** It's a way to execute a set of instructions multiple times, typically within a `for` or `while` statement. Think of it as saying, \"Do this thing again and again.\"\n\n**Here's a breakdown of the key aspects:**\n\n* **Repetition:** The core idea is to repeat a sequence of instructions.\n* **Control:** Loops are controlled by a condition – a statement that checks if the loop should continue. This condition is often based on a variable's value.\n* **`for` Loops"
                        }
                    ]
                },
                {
                    role: "user",
                    parts: [
                        {
                            text: "which is the fastest model across this for text summarization"
                        }
                    ]
                },
                {
                    role: "model",
                    parts: [
                        {
                            text: "Based on the list you provided, there's a clear trade-off between speed and the quality of the summary.\n\n### Short Answer\n\nThe fastest model will be **Gemma 3 1B**.\n\n### The Important Trade-Off: Speed vs. Quality\n\nWhile **Gemma 3 1B** is the fastest, it will also produce the simplest and potentially least accurate summary.\n\nHere's a breakdown of the models in your list:\n\n* **Fastest Model: `Gemma 3 1B`**\n  * **Why?** It has the fewest parameters (1 Billion). Fewer parameters mean fewer calculations are needed to generate a response, resulting in the lowest latency (fastest speed).\n  * **Downside:** Its smaller size means it has a less sophisticated understanding of language, which can lead to lower-quality, less nuanced summaries.\n\n* **Highest Quality Model: `Gemma 3 27B`**\n  * **Why?** It has the most parameters (27 Billion). This allows it to understand complex context, nuance, and instructions much better, leading to the most accurate and coherent summaries.\n  * **Downside:** It will be the slowest model on the list.\n\n* **A Good Balance: `Gemma 3 4B`**\n  * This is often a great middle-ground. It's significantly more capable than the 1B model but much faster than the 12B or 27B models. For many general summarization tasks, this model would likely provide a good balance of speed and quality.\n\n**In summary:**\n\nIf your absolute top priority is raw speed and you can tolerate a simpler summary, choose **Gemma 3 1B**. If you need the best possible summary and speed is not a major concern, choose **Gemma 3 27B**."
                        }
                    ]
                },
                {
                    role: "user",
                    parts: [
                        {
                            text: `Explain this text in 2-3 sentences:\n\n"${text}"`
                        }
                    ]
                }
            ],
            generationConfig: {
                responseMimeType: "text/plain",
                temperature: 0.3,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 150,
                stopSequences: []
            }
        };

        try {
            console.log('[Background] Sending request to Gemma-3-1b-it API...');
            
            const response = await fetch(GENAI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': this.apiKey
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('[Background] API request failed:', response.status, errorText);
                
                if (response.status === 401) {
                    return { 
                        success: false, 
                        error: 'Invalid API key. Please check your Gemini API key in the extension options.' 
                    };
                } else if (response.status === 429) {
                    return { 
                        success: false, 
                        error: 'API rate limit exceeded. Please try again in a moment.' 
                    };
                } else if (response.status === 400) {
                    return { 
                        success: false, 
                        error: 'Invalid request format or unsupported model. Please try again.' 
                    };
                } else {
                    return { 
                        success: false, 
                        error: `API request failed: ${response.status} ${response.statusText}` 
                    };
                }
            }

            const data = await response.json();
            console.log('[Background] Received response from Gemma-3-1b-it API');

            if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
                let explanation = data.candidates[0].content.parts[0].text.trim();
                
                // Clean up the response similar to the Python streaming approach
                explanation = explanation.replace(/^\s+|\s+$/g, ''); // Trim whitespace
                explanation = explanation.replace(/\n{3,}/g, '\n\n'); // Reduce multiple newlines
                
                // Remove common AI response prefixes
                const prefixesToRemove = [
                    /^Here's a 2-3 sentence explanation of the text:\s*/i,
                    /^Here's a (\d+-\d+|\d+) sentence explanation of the text:\s*/i,
                    /^Here's a (\d+-\d+|\d+) sentence explanation:\s*/i,
                    /^Here's a brief explanation of the text:\s*/i,
                    /^Here's an explanation of the text:\s*/i,
                    /^Here's what the text means:\s*/i,
                    /^Here's a summary of the text:\s*/i,
                    /^Here's the explanation:\s*/i,
                    /^Here's the summary:\s*/i,
                    /^Here's what this means:\s*/i,
                    /^Here's what this text is about:\s*/i,
                    /^This text explains:\s*/i,
                    /^The text is about:\s*/i,
                    /^In summary:\s*/i,
                    /^To summarize:\s*/i,
                    /^Explanation:\s*/i,
                    /^Summary:\s*/i,
                    /^The meaning is:\s*/i,
                    /^This means:\s*/i,
                    /^Simply put:\s*/i,
                    /^In simple terms:\s*/i,
                    /^Basically:\s*/i,
                    /^Here's the explanation:\s*/i,
                    /^Let me explain:\s*/i,
                    /^The text says:\s*/i,
                    /^This is about:\s*/i,
                    /^The passage discusses:\s*/i,
                    /^The content explains:\s*/i,
                    /^In essence:\s*/i,
                    /^To put it simply:\s*/i,
                    /^Here's what's happening:\s*/i,
                    /^Here are the key points:\s*/i,
                    /^The main idea is:\s*/i,
                    /^Here's a (\d+)-sentence explanation:\s*/i,
                    /^Here's a (\d+) sentence explanation:\s*/i
                ];
                
                // Apply prefix removal multiple times to catch nested prefixes
                let previousLength;
                do {
                    previousLength = explanation.length;
                    for (const prefix of prefixesToRemove) {
                        explanation = explanation.replace(prefix, '');
                    }
                    explanation = explanation.trim();
                } while (explanation.length < previousLength && explanation.length > 0);
                
                // Remove quotes around the explanation if present
                explanation = explanation.replace(/^["']|["']$/g, '');
                
                if (!explanation) {
                    explanation = "I couldn't generate a clear explanation for this text. Please try selecting a different piece of text.";
                }
                
                // Cache the successful explanation
                await this.cache.cacheExplanation(text, explanation);
                
                return { 
                    success: true, 
                    explanation: explanation,
                    fromCache: false
                };
            } else {
                console.error('[Background] Unexpected API response format:', data);
                return { 
                    success: false, 
                    error: 'Unexpected response format from API. The model may not be available.' 
                };
            }

        } catch (error) {
            console.error('[Background] Network error:', error);
            return { 
                success: false, 
                error: 'Network error. Please check your internet connection and try again.' 
            };
        }
    }

    getStatus() {
        return {
            hasApiKey: !!this.apiKey,
            ready: !!this.apiKey,
            model: 'Gemma-3-1b-it',
            cache: this.cache.getCacheStats()
        };
    }

    async clearCache() {
        return await this.cache.clearCache();
    }
}

const gemmaExplainer = new GemmaExplainer();

// Create context menu
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "explanium-explain",
        title: "Explain with Explanium",
        contexts: ["selection"]
    });
    console.log('[Background] Context menu created');
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "explanium-explain" && info.selectionText) {
        console.log('[Background] Context menu clicked with text:', info.selectionText.substring(0, 50) + '...');
        
        // Check if extension is enabled before processing
        try {
            const result = await chrome.storage.sync.get(['explanium_settings']);
            const settings = result.explanium_settings || { enabled: true, autoExplain: true, longText: false };
            
            if (!settings.enabled) {
                console.log('[Background] Extension is disabled, ignoring context menu request');
                return;
            }
        } catch (error) {
            console.error('[Background] Failed to check settings:', error);
        }
        
        // Send message to content script to show explanation
        chrome.tabs.sendMessage(tab.id, {
            type: 'CONTEXT_MENU_EXPLAIN',
            text: info.selectionText
        }).catch(error => {
            console.error('[Background] Failed to send context menu message:', error);
        });
    }
});

// Message handler
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(`[Background] Received message type: ${request.type}`, request);

    switch (request.type) {
        case 'GET_STATUS':
            sendResponse(gemmaExplainer.getStatus());
        return false;

        case 'SET_API_KEY':
            gemmaExplainer.saveApiKey(request.apiKey)
                .then(response => {
                    console.log('[Background] API key save result:', response);
                    sendResponse(response);
                })
                .catch(error => {
                    console.error('[Background] Error saving API key:', error);
                    sendResponse({ success: false, error: error.message });
                });
            return true; // Async response

        case 'EXPLAIN_TEXT':
            // Check if extension is enabled before processing explanation
            chrome.storage.sync.get(['explanium_settings'])
                .then(result => {
                    const settings = result.explanium_settings || { enabled: true, autoExplain: true, longText: false };
                    
                    if (!settings.enabled) {
                        console.log('[Background] Extension is disabled, rejecting explanation request');
                        sendResponse({ success: false, error: 'Extension is disabled' });
                        return;
                    }
                    
                    // Proceed with explanation
                    return gemmaExplainer.explainText(request.text);
                })
                .then(response => {
                    if (response) {
                        console.log('[Background] Explanation result:', response.success ? 'Success' : response.error);
                        if (response.fromCache) {
                            console.log('[Background] ⚡ Response served from cache - instant!');
                        }
                        sendResponse(response);
                    }
                })
                .catch(error => {
                    console.error('[Background] Error explaining text:', error);
                    sendResponse({ success: false, error: error.message });
                });
            return true; // Async response

        case 'GET_CACHE_STATS':
            sendResponse(gemmaExplainer.cache.getCacheStats());
            return false;

        case 'CLEAR_CACHE':
            gemmaExplainer.clearCache()
                .then(response => {
                    console.log('[Background] Cache clear result:', response);
                    sendResponse(response);
                })
                .catch(error => {
                    console.error('[Background] Error clearing cache:', error);
                    sendResponse({ success: false, error: error.message });
                });
            return true; // Async response

        default:
            console.warn(`[Background] Unknown request type: ${request.type}`);
            sendResponse({ success: false, error: `Unknown request type: ${request.type}` });
            return false;
    }
});

console.log('[Background] Background script loaded and listener is active.');
