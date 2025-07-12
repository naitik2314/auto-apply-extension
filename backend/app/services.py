# File: backend/app/services.py

from .models import JobDetails, UserProfile

# --- FAKE n8n WORKFLOW ---
# We are pretending to call your n8n workflow.
# In the future, this will make a real web request.
def trigger_n8n_workflow(url: str, job_details: JobDetails, user_profile: UserProfile) -> str:
    print("--- MOCK SERVICE ---")
    print(f"Triggering n8n workflow at URL: {url}")
    print(f"Job Title: {job_details.title}")
    print(f"User Name: {user_profile.full_name}")
    print("--- RETURNING FAKE FILE ID ---")
    
    # Pretend n8n ran successfully and gave us a file ID from Google Drive
    return "fake-gdrive-id-12345"


# --- FAKE GOOGLE DRIVE DOWNLOAD ---
# We are pretending to download the file n8n created.
# In the future, this will use the Google Drive API.
def download_file_from_google_drive(file_id: str) -> tuple[str, bytes]:
    print("--- MOCK SERVICE ---")
    print(f"Downloading file from Google Drive with ID: {file_id}")
    print("--- RETURNING FAKE FILE ---")

    # Pretend we downloaded a PDF.
    fake_filename = "Tailored_Resume_for_ApexFoundry.pdf"
    fake_file_content = b"%PDF-1.4\n...fake PDF content..." # bytes object
    
    return (fake_filename, fake_file_content)