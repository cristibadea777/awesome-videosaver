from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from starlette.background import BackgroundTask
from pydantic import BaseModel
from pathlib import Path
import tempfile
import os
import traceback

from downloader import download_clip

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-File-Name"],
)

SERVER_TEMP_FOLDER = Path(tempfile.gettempdir()) / "awesome_videosaver"

class DownloadRequest(BaseModel):
    url: str
    start: str
    end: str
    format: str

@app.get("/")
def root():
    return {"status": "server online"}

@app.post("/download")
def download_video(req: DownloadRequest):
    try:
        print("CERERE DOWNLOAD:", req)

        SERVER_TEMP_FOLDER.mkdir(parents=True, exist_ok=True)

        file_path = download_clip(
            video_url=req.url,
            start_time=req.start,
            end_time=req.end,
            video_format=req.format,
            output_dir=str(SERVER_TEMP_FOLDER)
        )

        file_name = Path(file_path).name

        media_type = "video/mp4"
        if req.format == "mp3":
            media_type = "audio/mpeg"

        return FileResponse(
            path=file_path,
            filename=file_name,
            media_type=media_type,
            headers={"X-File-Name": file_name},
            background=BackgroundTask(os.remove, file_path)
        )

    except Exception as e:
        print("EROARE BACKEND:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))