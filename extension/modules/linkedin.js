// File: extension/modules/linkedin.js

(function() {
    console.log("LinkedIn Adapter Initialized.");

    // --- HELPER FUNCTIONS ---
    function waitForElement(selector) {
        return new Promise(resolve => {
            const element = document.querySelector(selector);
            if (element) return resolve(element);
            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                    observer.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    // New helper to securely get data via the content script bridge
    function getProfileViaBridge() {
        return new Promise((resolve, reject) => {
            // Listen for the response from the content script
            const messageListener = (event) => {
                if (event.source === window && event.data.type === "FROM_CONTENT_SCRIPT") {
                    window.removeEventListener("message", messageListener); // Clean up listener
                    if (event.data.error) {
                        reject(new Error(event.data.error));
                    } else {
                        resolve(event.data);
                    }
                }
            };
            window.addEventListener("message", messageListener);

            // Send the request to the content script
            window.postMessage({ type: "FROM_PAGE_SCRIPT", action: "getProfile" }, "*");
        });
    }

    // --- MAIN LOGIC ---
    async function runLinkedInAutomation() {
        const applyButton = document.createElement('button');
        applyButton.innerText = '🚀 Auto-Apply (LI)';
        applyButton.className = 'auto-apply-button';
        document.body.appendChild(applyButton);

        applyButton.addEventListener('click', async () => {
            console.log("LinkedIn Auto-Apply sequence initiated!");

            // 1. Get User Profile via the bridge
            let data;
            try {
                data = await getProfileViaBridge();
            } catch (error) {
                console.error("Could not get profile via bridge:", error);
                alert("Error: Could not retrieve user profile.");
                return;
            }

            if (!data || !data.userProfile || !data.userProfile.phone) {
                alert("Please save your profile (especially phone number) in the extension popup first!");
                return;
            }
            const userProfile = data.userProfile;

            // 2. Scrape Job Details - ALL OF THEM
            console.log("Scraping job details...");
            const titleSelector = ".t-24.job-details-jobs-unified-top-card__job-title";
            const companySelector = ".job-details-jobs-unified-top-card__company-name";
            const descriptionSelector = ".job-details-about-the-job-module__description";

            const title = document.querySelector(titleSelector)?.innerText.trim();
            const company = document.querySelector(companySelector)?.innerText.trim();
            const description = document.querySelector(descriptionSelector)?.innerText.trim();

            if (!title || !company) {
                alert("Could not find job title or company.");
                return;
            }
            console.log(`Found: ${title} at ${company}. Desc length: ${description?.length || 0}`);

            // 3. Click "Easy Apply"
            const easyApplyButton = await waitForElement(".jobs-apply-button");
            easyApplyButton.click();

            // 4. Fill the phone number
            const phoneInput = await waitForElement("input[id*='phoneNumber']");
            phoneInput.value = userProfile.phone;
            phoneInput.dispatchEvent(new Event('input', { bubbles: true }));

            alert("Phone number filled. Please review and proceed.");
        });
    }

    runLinkedInAutomation();
})();