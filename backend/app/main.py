# File: backend/app/main.py

from fastapi import FastAPI, HTTPException
from fastapi.responses import Response # Use Response for file downloads

from .models import ApplyRequest, ApplyResponse
from .services import trigger_n8n_workflow, download_file_from_google_drive

# For the MVP, we hardcode the URL. Later, this will come from a config file.
# TODO: Move this to a secure configuration file
N8N_WEBHOOK_URL = "http://localhost:5678/webhook/your-test-webhook"

app = FastAPI(title="Auto-Apply MVP Backend")

@app.post("/apply", response_model=ApplyResponse)
async def apply_for_job(request: ApplyRequest):
    """
    This is the main endpoint the Chrome extension will call.
    It simulates the full process and returns a file ID.
    """
    try:
        gdrive_file_id = trigger_n8n_workflow(
            url=N8N_WEBHOOK_URL,
            job_details=request.job_details,
            user_profile=request.user_profile
        )

        # In a real app, you might want to fetch a real filename
        # but we'll return a static one for now.
        return ApplyResponse(
            message="Resume generated successfully.",
            resume_file_id=gdrive_file_id,
            resume_file_name=f"Resume_for_{request.job_details.company}.pdf"
        )
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail="An internal error occurred.")


@app.get("/download/{file_id}")
async def download_resume(file_id: str):
    """
    This endpoint simulates downloading the resume using the file_id.
    """
    try:
        file_name, file_bytes = download_file_from_google_drive(file_id)

        # This tells the browser to treat the response as a file download
        headers = {'Content-Disposition': f'attachment; filename="{file_name}"'}
        return Response(content=file_bytes, media_type="application/pdf", headers=headers)
        
    except Exception as e:
        print(f"An error occurred during download: {e}")
        raise HTTPException(status_code=500, detail="Could not download file.")