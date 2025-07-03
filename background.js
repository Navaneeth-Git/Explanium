console.log('[Background] Script start.');

import { AIModelManager } from './ai-model-manager.js';

const aiManager = new AIModelManager();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(`[Background] Received message type: ${request.type}`, request);

    // This is a special, internal message from the offscreen document.
    // It's used for the handshake to confirm the offscreen is ready.
    if (request.type === 'offscreen-ready') {
        console.log('[Background] Received offscreen-ready signal.');
        if (aiManager.handleOffscreenReady) {
            aiManager.handleOffscreenReady();
        }
        // No response needed, this is a one-way signal.
        return false;
    }
    
    // For all other messages, we delegate to the AI Manager.
    // The AI Manager will handle the logic and return a response.
    if (aiManager.handleRequest) {
        console.log(`[Background] Forwarding message "${request.type}" to AIModelManager.`);
        aiManager.handleRequest(request, sender)
            .then(response => {
                console.log(`[Background] Sending response for "${request.type}":`, response);
                sendResponse(response);
            })
            .catch(error => {
                console.error(`[Background] Error handling request "${request.type}":`, error);
                sendResponse({ error: error.message || 'An unknown error occurred in the background script.' });
            });
    }
    
    // Return true to indicate that we will be sending a response asynchronously.
    // This is crucial for keeping the message channel open.
    return true; 
});

console.log('[Background] Background script loaded and listener is active.');
