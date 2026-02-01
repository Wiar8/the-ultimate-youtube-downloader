"""FastAPI backend for YouTube video downloading."""

import uuid
from pathlib import Path
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

from downloader import get_video_info, download_video, DOWNLOADS_DIR

app = FastAPI(title="YouTube Downloader API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for download tasks
download_tasks: dict[str, dict] = {}


class DownloadRequest(BaseModel):
    url: str
    format_id: str


@app.get("/info")
async def info(url: str):
    """Get video metadata and available formats."""
    try:
        video_info = get_video_info(url)
        return video_info
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


def run_download(url: str, format_id: str, task_id: str):
    """Background task to download video."""
    try:
        filename = download_video(url, format_id, task_id)
        download_tasks[task_id] = {
            "status": "completed",
            "file_url": f"/files/{filename}",
        }
    except Exception as e:
        download_tasks[task_id] = {
            "status": "failed",
            "error": str(e),
        }


@app.post("/download")
async def start_download(request: DownloadRequest, background_tasks: BackgroundTasks):
    """Start a background download task."""
    task_id = str(uuid.uuid4())[:8]
    download_tasks[task_id] = {"status": "downloading"}

    background_tasks.add_task(run_download, request.url, request.format_id, task_id)

    return {"task_id": task_id}


@app.get("/download/{task_id}")
async def get_download_status(task_id: str):
    """Check download status."""
    if task_id not in download_tasks:
        raise HTTPException(status_code=404, detail="Task not found")

    return download_tasks[task_id]


@app.get("/files/{filename}")
async def serve_file(filename: str):
    """Serve downloaded files."""
    file_path = DOWNLOADS_DIR / filename

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(file_path, filename=filename)
