console.log('[Background] Script start.');

// Google GenAI configuration
const GENAI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemma-3-1b-it:generateContent';

class GemmaExplainer {
    constructor() {
        this.apiKey = null;
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
                
                return { 
                    success: true, 
                    explanation: explanation 
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
            model: 'Gemma-3-1b-it'
        };
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
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "explanium-explain" && info.selectionText) {
        console.log('[Background] Context menu clicked with text:', info.selectionText.substring(0, 50) + '...');
        
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
            gemmaExplainer.explainText(request.text)
            .then(response => {
                    console.log('[Background] Explanation result:', response.success ? 'Success' : response.error);
                sendResponse(response);
            })
            .catch(error => {
                    console.error('[Background] Error explaining text:', error);
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
