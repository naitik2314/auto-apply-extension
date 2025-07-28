// File: extension/content.js
console.log("Auto-Apply Bridge (content.js) Loaded.");

// --- This is the new communication bridge ---

// 1. Listen for messages coming from the injected script (e.g., linkedin.js)
window.addEventListener("message", (event) => {
    // We only accept messages from ourselves
    if (event.source !== window) {
        return;
    }

    const { type, action } = event.data;
    if (type === "FROM_PAGE_SCRIPT" && action === "getProfile") {
        console.log("Bridge: Received profile request from page, forwarding to background.");
        
        // 2. Forward the request to the background script
        chrome.runtime.sendMessage({ action: "getProfile" }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("Bridge: Error sending message to background:", chrome.runtime.lastError);
                return;
            }
            console.log("Bridge: Received profile from background, sending back to page.");
            
            // 3. Send the response from the background script back to the page
            window.postMessage({ type: "FROM_CONTENT_SCRIPT", ...response }, "*");
        });
    }
}, false);


// --- The router logic stays the same ---
const hostname = window.location.hostname;
let adapterPath;

if (hostname.includes("linkedin.com")) {
    adapterPath = "modules/linkedin.js";
} else if (hostname.includes("boards.greenhouse.io")) {
    adapterPath = "modules/greenhouse.js";
}

if (adapterPath) {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL(adapterPath);
    (document.head || document.documentElement).appendChild(script);
    script.onload = () => script.remove();
}