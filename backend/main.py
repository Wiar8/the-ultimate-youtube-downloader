"""FastAPI backend for YouTube video downloading."""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

from downloader import (
    get_video_info,
    download_audio,
    download_video,
    cleanup_old_files,
    DOWNLOADS_DIR,
)

app = FastAPI(title="YouTube Downloader API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AudioDownloadRequest(BaseModel):
    url: str


class VideoDownloadRequest(BaseModel):
    url: str
    height: int


@app.get("/info")
async def info(url: str):
    """Get video metadata and available qualities."""
    try:
        video_info = get_video_info(url)
        return video_info
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/download/audio")
async def download_audio_endpoint(
    request: AudioDownloadRequest,
    background_tasks: BackgroundTasks
):
    """Download video as MP3 audio."""
    try:
        result = download_audio(request.url)
        # Schedule cleanup of old files
        background_tasks.add_task(cleanup_old_files)
        return {
            "filename": result["filename"],
            "title": result["title"],
            "download_url": f"/files/{result['filename']}",
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/download/video")
async def download_video_endpoint(
    request: VideoDownloadRequest,
    background_tasks: BackgroundTasks
):
    """Download video with audio as MP4."""
    try:
        result = download_video(request.url, request.height)
        # Schedule cleanup of old files
        background_tasks.add_task(cleanup_old_files)
        return {
            "filename": result["filename"],
            "title": result["title"],
            "download_url": f"/files/{result['filename']}",
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/files/{filename}")
async def serve_file(filename: str):
    """Serve downloaded files."""
    file_path = DOWNLOADS_DIR / filename

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    # Determine media type
    if filename.endswith(".mp3"):
        media_type = "audio/mpeg"
    elif filename.endswith(".mp4"):
        media_type = "video/mp4"
    else:
        media_type = "application/octet-stream"

    return FileResponse(
        file_path,
        filename=filename,
        media_type=media_type,
    )
