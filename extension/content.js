console.log("Auto-Apply MVP script loaded!");

// Create the button
const applyButton = document.createElement('button');
applyButton.innerText = '🚀 Auto-Apply';

// Style the button so it's visible
Object.assign(applyButton.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    padding: '15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    zIndex: '9999'
});

// Add the button to the page
document.body.appendChild(applyButton);

// --- The Core Logic ---
async function handleApplyClick() {
    console.log("Apply button clicked!");

    // 1. Get the saved user profile from storage
    const data = await chrome.storage.local.get('userProfile');
    if (!data.userProfile) {
        alert("Please save your profile in the extension popup first!");
        return;
    }

    // 2. Scrape job details (we'll use FAKE data for now)
    // TODO: Replace this with real scraping logic later
    const jobDetails = {
        title: "Software Engineer",
        company: document.title, // Just grab the website title for now
        description: "A very exciting role.",
        source_url: window.location.href
    };

    const requestPayload = {
        user_profile: data.userProfile,
        job_details: jobDetails
    };
    
    console.log("Sending this data to the backend:", requestPayload);
    alert("Check the console (Cmd+Option+J) to see the data we're sending!");

    // 3. Call our backend API
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
        alert(`Success! Backend returned file ID: ${result.resume_file_id}`);

    } catch (error) {
        console.error("Error calling backend:", error);
        alert("Failed to call the backend. Is it running in your terminal?");
    }
}

applyButton.addEventListener('click', handleApplyClick);