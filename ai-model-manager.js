console.log('[AIModelManager] Script start.');

const OFFSCREEN_DOCUMENT_PATH = '/offscreen.html';

export class AIModelManager {
    constructor() {
        this.active = false;
        this.activating = false;
        this.error = null;
        
        // Handshake mechanism state
        this.isOffscreenReady = false;
        this.resolveOffscreenReady = null;
        this.isOffscreenReadyPromise = new Promise((resolve) => {
            this.resolveOffscreenReady = resolve;
        });

        // Queue for messages that arrive before the offscreen document is ready
        this.messageQueue = [];
    }

    // Central request handler delegated from background.js
    async handleRequest(request, sender) {
        console.log(`[AIModelManager] Handling request: ${request.type}`);
        switch (request.type) {
            case 'GET_MODEL_STATUS':
                return this.getStatus();
            case 'ACTIVATE_MODEL':
                return this.activate();
            case 'EXPLAIN_TEXT':
                return this.explainText(request.text);
            default:
                console.warn(`[AIModelManager] Unknown request type: ${request.type}`);
                return { error: `Unknown request type: ${request.type}` };
        }
    }

    getStatus() {
        return {
            active: this.active,
            activating: this.activating,
            error: this.error,
        };
    }

    async activate() {
        if (this.active || this.activating) {
            console.log('[AIModelManager] Activation requested but already active or activating.');
            return { success: true, message: 'Model is already active or activating.' };
        }

        console.log('[AIModelManager] Starting model activation...');
        this.activating = true;
        this.error = null;

        try {
            await this.ensureOffscreenDocument();
            
            console.log('[AIModelManager] Waiting for offscreen document to be ready...');
            await this.isOffscreenReadyPromise;
            console.log('[AIModelManager] Offscreen is ready. Sending activation message.');

            const response = await this.sendToOffscreen({ type: 'ACTIVATE_MODEL' });

            if (response.success) {
                this.active = true;
                console.log('[AIModelManager] Model activated successfully.');
            } else {
                this.error = response.error || 'Unknown activation error.';
                console.error(`[AIModelManager] Activation failed: ${this.error}`);
            }
            return response;
        } catch (e) {
            console.error('[AIModelManager] Critical error during activation:', e);
            this.error = e.message;
            return { success: false, error: e.message };
        } finally {
            this.activating = false;
        }
    }

    async explainText(text) {
        if (!this.active) {
            return { error: "Model is not active. Please activate it from the options page." };
        }
        console.log('[AIModelManager] Forwarding EXPLAIN_TEXT to offscreen.');
        return this.sendToOffscreen({ type: 'EXPLAIN_TEXT', text });
    }

    async ensureOffscreenDocument() {
        console.log('[AIModelManager] Checking for existing offscreen document...');
        const existingContexts = await chrome.runtime.getContexts({
            contextTypes: ['OFFSCREEN_DOCUMENT'],
            documentUrls: [chrome.runtime.getURL(OFFSCREEN_DOCUMENT_PATH)]
        });

        if (existingContexts.length > 0) {
            console.log('[AIModelManager] Offscreen document already exists.');
            return;
        }
        
        console.log('[AIModelManager] Creating new offscreen document...');
        await chrome.offscreen.createDocument({
            url: OFFSCREEN_DOCUMENT_PATH,
            reasons: ['USER_INTERACTION', 'BLOB'],
            justification: 'Run AI model for text explanations'
        });
        console.log('[AIModelManager] Offscreen document created.');
    }
    
    // Called by background.js when it receives the 'offscreen-ready' signal
    handleOffscreenReady() {
        console.log('[AIModelManager] Offscreen ready signal received. Resolving promise and processing queue.');
        this.isOffscreenReady = true;
        if (this.resolveOffscreenReady) {
            this.resolveOffscreenReady();
        }
        // Process any queued messages
        this.processMessageQueue();
    }
    
    // Send a message, waiting for readiness if needed
    async sendToOffscreen(message) {
        if (!this.isOffscreenReady) {
            console.log('[AIModelManager] Offscreen not ready. Queuing message:', message.type);
            // Return a promise that resolves when the message is eventually sent and a response is received
            return new Promise(resolve => {
                this.messageQueue.push({ message, resolve });
            });
        }
        console.log('[AIModelManager] Offscreen is ready. Sending message immediately:', message.type);
        return chrome.runtime.sendMessage(message);
    }

    processMessageQueue() {
        console.log(`[AIModelManager] Processing ${this.messageQueue.length} queued messages.`);
        while (this.messageQueue.length > 0) {
            const { message, resolve } = this.messageQueue.shift();
            chrome.runtime.sendMessage(message)
                .then(resolve)
                .catch(error => {
                    console.error('[AIModelManager] Error sending queued message:', error);
                    // Resolve with an error object so the caller promise doesn't hang
                    resolve({ error: error.message });
                });
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AIModelManager;
} 