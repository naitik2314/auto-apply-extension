console.log("Auto-Apply MVP script v2 loaded!");

// Create the button element
const applyButton = document.createElement('button');
applyButton.innerText = '🚀 Auto-Apply';

// Instead of adding inline styles, we now add a CSS class.
// The styling is handled by our style.css file, which is CSP-compliant.
applyButton.className = 'auto-apply-button';

// Add the button to the page's body
document.body.appendChild(applyButton);

// --- The Core Logic ---
// This function runs when the button is clicked
async function handleApplyClick() {
    console.log("Apply button clicked! Starting scraping...");

    // 1. Get the saved user profile from the extension's local storage
    const data = await chrome.storage.local.get('userProfile');
    if (!data.userProfile || !data.userProfile.full_name) {
        alert("Please save your profile in the extension popup first!");
        return;
    }

    // 2. Scrape REAL job details from the page using CSS selectors
    // NOTE: These selectors are for LinkedIn and might need updating if they change their site.
    // This tells the browser to find an element that has BOTH the 't-24' class AND the 'job-details-jobs-unified-top-card__job-title' class.
    const titleSelector = ".t-24.job-details-jobs-unified-top-card__job-title";

    // These look correct already as they only have one class.
    const companySelector = ".job-details-jobs-unified-top-card__company-name";
    const descriptionSelector = ".job-details-about-the-job-module__description";

    // The '?' is optional chaining: if an element isn't found, it returns 'undefined' instead of crashing.
    const title = document.querySelector(titleSelector)?.innerText.trim();
    const company = document.querySelector(companySelector)?.innerText.trim();
    const description = document.querySelector(descriptionSelector)?.innerText.trim();

    // Validate that we actually found the key information
    if (!title || !company) {
        alert("Could not find the job title or company on this page. Make sure you're on a LinkedIn job page.");
        console.error("Scraping failed. Selectors might be outdated or you might not be on the right page.");
        return;
    }

    // Assemble the scraped data into an object
    const jobDetails = {
        title: title,
        company: company,
        description: description || "No description found.", // Use a fallback if description is missing
        source_url: window.location.href
    };

    // Combine user and job data into the final payload for our backend
    const requestPayload = {
        user_profile: data.userProfile,
        job_details: jobDetails
    };
    
    console.log("Sending REAL scraped data to the backend:", requestPayload);
    alert("Check the console (Cmd+Option+J) to see the REAL data we're sending!");

    // 3. Call our backend API to trigger the resume generation
    try {
        const response = await fetch('http://127.0.0.1:8000/apply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestPayload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Backend response:", result);
        alert(`Success! Backend confirmed receipt for job: ${jobDetails.title}`);

    } catch (error) {
        console.error("Error calling backend:", error);
        alert("Failed to call the backend. Is it running in your terminal?");
    }
}

// Attach the function to the button's click event
applyButton.addEventListener('click', handleApplyClick);