"""FastAPI backend for YouTube video downloading."""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from downloader import get_video_info, get_download_url

app = FastAPI(title="YouTube Downloader API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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


@app.post("/download")
async def download(request: DownloadRequest):
    """Get direct download URL for a specific format."""
    try:
        result = get_download_url(request.url, request.format_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
