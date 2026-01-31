"""yt-dlp wrapper functions for video downloading."""

import os
import yt_dlp
from pathlib import Path

DOWNLOADS_DIR = Path(__file__).parent / "downloads"
DOWNLOADS_DIR.mkdir(exist_ok=True)


def get_video_info(url: str) -> dict:
    """Fetch video metadata and available formats."""
    ydl_opts = {
        "quiet": True,
        "no_warnings": True,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)

    formats = []
    for f in info.get("formats", []):
        # Only include formats with both video and audio, or audio-only
        if f.get("vcodec") != "none" or f.get("acodec") != "none":
            format_info = {
                "format_id": f.get("format_id"),
                "ext": f.get("ext"),
                "resolution": f.get("resolution") or f.get("format_note"),
                "filesize": f.get("filesize") or f.get("filesize_approx"),
            }
            formats.append(format_info)

    return {
        "id": info.get("id"),
        "title": info.get("title"),
        "thumbnail": info.get("thumbnail"),
        "duration": info.get("duration"),
        "formats": formats,
    }


def download_video(url: str, format_id: str, task_id: str) -> str:
    """Download video and return the filename."""
    output_template = str(DOWNLOADS_DIR / f"{task_id}.%(ext)s")

    ydl_opts = {
        "format": format_id,
        "outtmpl": output_template,
        "quiet": True,
        "no_warnings": True,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        ext = info.get("ext")
        return f"{task_id}.{ext}"
