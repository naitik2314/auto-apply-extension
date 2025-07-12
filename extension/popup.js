// Get the form elements
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const saveButton = document.getElementById('saveButton');
const statusDiv = document.getElementById('status');

// Function to save the profile data
function saveProfile() {
    const userProfile = {
        full_name: nameInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
    };

    // Use the Chrome Storage API to save data locally
    chrome.storage.local.set({ userProfile: userProfile }, () => {
        statusDiv.textContent = 'Profile Saved!';
        setTimeout(() => { statusDiv.textContent = ''; }, 2000);
    });
}

// Function to load the profile data when the popup opens
function loadProfile() {
    chrome.storage.local.get('userProfile', (data) => {
        if (data.userProfile) {
            nameInput.value = data.userProfile.full_name || '';
            emailInput.value = data.userProfile.email || '';
            phoneInput.value = data.userProfile.phone || '';
        }
    });
}

// Add event listeners
saveButton.addEventListener('click', saveProfile);
document.addEventListener('DOMContentLoaded', loadProfile);