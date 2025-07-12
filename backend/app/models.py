# File: backend/app/models.py

from pydantic import BaseModel, HttpUrl

# Defines the structure for the user's base information
class UserProfile(BaseModel):
    full_name: str
    email: str
    phone: str

# Defines the structure for the job data we scrape
class JobDetails(BaseModel):
    title: str
    company: str
    description: str
    source_url: str # We'll keep it simple for now

# This is what our extension will send TO the backend
class ApplyRequest(BaseModel):
    user_profile: UserProfile
    job_details: JobDetails

# This is what our backend will send BACK to the extension
class ApplyResponse(BaseModel):
    message: str
    resume_file_id: str
    resume_file_name: str