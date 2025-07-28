// File: extension/background.js
console.log("Background service worker loaded.");

// Listen for messages from our adapter scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // We're checking for a specific 'action' in the message
    if (request.action === "getProfile") {
        console.log("Background script: Received 'getProfile' request.");
        
        // Use the storage API, which is available here
        chrome.storage.local.get('userProfile', (data) => {
            if (chrome.runtime.lastError) {
                console.error("Background script:", chrome.runtime.lastError);
                sendResponse({ error: chrome.runtime.lastError.message });
            } else {
                // Send the profile data back to the script that asked for it
                console.log("Background script: Sending profile data back:", data);
                sendResponse(data);
            }
        });
        
        // This 'return true' is essential. It tells Chrome that we will
        // send a response asynchronously.
        return true; 
    }
});