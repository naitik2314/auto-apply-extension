// File: auto-apply-mvp/extension/content.js

console.log("Auto-Apply MVP script v6 (All-In-One) loaded!");

// --- HELPER FUNCTION ---
// Waits for an element to appear on the page before we try to use it.
function waitForElement(selector) {
    return new Promise(resolve => {
        const element = document.querySelector(selector);
        if (element) {
            return resolve(element);
        }

        const observer = new MutationObserver(mutations => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

// Create the button element
const applyButton = document.createElement('button');
applyButton.innerText = '🚀 Auto-Apply';
applyButton.className = 'auto-apply-button';
document.body.appendChild(applyButton);

// --- The Core Logic ---
async function handleApplyClick() {
    console.log("Auto-Apply sequence initiated!");

    // 1. Get User Profile from storage
    const data = await chrome.storage.local.get('userProfile');
    if (!data.userProfile || !data.userProfile.phone) {
        alert("Please save your profile (especially phone number) in the extension popup first!");
        return;
    }
    const userProfile = data.userProfile;

    // 2. Scrape Job Details using YOUR proven selectors
    console.log("Scraping job details from the main page...");
    const titleSelector = ".t-24.job-details-jobs-unified-top-card__job-title";
    const companySelector = ".job-details-jobs-unified-top-card__company-name";
    const descriptionSelector = ".job-details-about-the-job-module__description";

    const title = document.querySelector(titleSelector)?.innerText.trim();
    const company = document.querySelector(companySelector)?.innerText.trim();
    const description = document.querySelector(descriptionSelector)?.innerText.trim();

    if (!title || !company) {
        alert("Could not find job title or company. The page structure may have changed.");
        return;
    }
    console.log(`Found job: ${title} at ${company}`);
    // We can use the description later if needed, for now we just log it.
    console.log(`Description found, length: ${description?.length || 0}`);

    // 3. Find and Click the "Easy Apply" button
    const easyApplyButtonSelector = ".jobs-apply-button";
    const easyApplyButton = await waitForElement(easyApplyButtonSelector);
    console.log("Found Easy Apply button, clicking...");
    easyApplyButton.click();

    // 4. Wait for the form and fill ONLY the phone number
    console.log("Waiting for application form to load...");

    // ACTION REQUIRED: Confirm this selector is correct for the phone input field.
    const phoneInputSelector = "input[id*='phoneNumber']";
    
    const phoneInput = await waitForElement(phoneInputSelector);
    console.log("Found phone field, filling...");
    phoneInput.value = userProfile.phone;
    
    // Dispatch event to ensure the website recognizes the change.
    phoneInput.dispatchEvent(new Event('input', { bubbles: true }));

    console.log("Phone number auto-filling complete!");
    alert("Phone number filled. Please review and proceed.");
}

// Attach the function to the button's click event
applyButton.addEventListener('click', handleApplyClick);