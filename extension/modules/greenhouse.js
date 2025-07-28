// File: extension/modules/greenhouse.js

(function() {
    console.log("Greenhouse Adapter Initialized.");

    // --- HELPER FUNCTION ---
    // You'll need this helper function here as well.
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
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    // --- MAIN LOGIC ---
    async function runGreenhouseAutomation() {
        // TODO: Create and inject a custom button for Greenhouse pages.
        // It will be different from the LinkedIn one since there's no "Easy Apply" equivalent.
        // Usually, you'll just fill the form that's already on the page.
        console.log("Running Greenhouse automation logic...");
        
        // TODO: Find the selectors for Greenhouse forms.
        // Example selectors (these will likely need to be updated):
        const firstNameSelector = "input#first_name";
        const lastNameSelector = "input#last_name";
        const emailSelector = "input#email";
        const phoneSelector = "input#phone";
        // ... and so on for other fields.

        // TODO: Get user profile from chrome.storage
        const { userProfile } = await chrome.storage.local.get('userProfile');
        if (!userProfile) {
            console.log("No user profile found.");
            return;
        }

        // TODO: Use waitForElement to find and fill each field.
        // Example for one field:
        // const firstNameInput = await waitForElement(firstNameSelector);
        // firstNameInput.value = userProfile.full_name.split(' ')[0]; // Example of splitting name
        // firstNameInput.dispatchEvent(new Event('input', { bubbles: true }));

        alert("This is the Greenhouse adapter. It's ready for you to add the form-filling logic!");
    }

    // Run the automation
    runGreenhouseAutomation();

})();