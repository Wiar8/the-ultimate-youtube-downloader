"""yt-dlp wrapper functions for video downloading."""

import re
import uuid
from pathlib import Path
import yt_dlp

DOWNLOADS_DIR = Path(__file__).parent / "downloads"
DOWNLOADS_DIR.mkdir(exist_ok=True)

COOKIES_FILE = Path(__file__).parent / "cookies.txt"


def get_ydl_opts(base_opts: dict) -> dict:
    """Add cookies to opts if cookies.txt exists."""
    if COOKIES_FILE.exists():
        base_opts["cookiefile"] = str(COOKIES_FILE)
    return base_opts



def sanitize_filename(title: str) -> str:
    """Sanitize title for use as filename."""
    # Remove invalid characters
    clean = re.sub(r'[<>:"/\\|?*]', '', title)
    # Replace spaces with underscores
    clean = clean.replace(' ', '_')
    # Limit length
    clean = clean[:100]
    # Add unique suffix to avoid collisions
    suffix = str(uuid.uuid4())[:6]
    return f"{clean}_{suffix}"


def get_video_info(url: str) -> dict:
    """Fetch video metadata and available qualities."""
    ydl_opts = get_ydl_opts({
        "quiet": True,
        "no_warnings": True,
    })

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)

    # Get available video heights
    available_heights = set()
    for f in info.get("formats", []):
        height = f.get("height")
        if height:
            available_heights.add(height)

    # Create quality options (common resolutions)
    quality_options = []
    for height in sorted(available_heights, reverse=True):
        if height >= 360:  # Only show 360p and above
            quality_options.append({
                "height": height,
                "label": f"{height}p",
            })

    return {
        "id": info.get("id"),
        "title": info.get("title"),
        "thumbnail": info.get("thumbnail"),
        "duration": info.get("duration"),
        "qualities": quality_options,
    }


def download_audio(url: str) -> dict:
    """Download best audio quality as MP3."""
    # First get info to get the title
    with yt_dlp.YoutubeDL(get_ydl_opts({"quiet": True})) as ydl:
        info = ydl.extract_info(url, download=False)

    title = info.get("title", "audio")
    filename = sanitize_filename(title)

    ydl_opts = {
        "quiet": True,
        "no_warnings": True,
        "format": "bestaudio/best",
        "outtmpl": str(DOWNLOADS_DIR / f"{filename}.%(ext)s"),
        "postprocessors": [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": "320",
        }],
    })

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.extract_info(url, download=True)

    return {
        "filename": f"{filename}.mp3",
        "title": title,
    }


def download_video(url: str, height: int) -> dict:
    """Download video with audio merged as MP4 (H.264 + AAC for Mac compatibility)."""
    # First get info to get the title
    with yt_dlp.YoutubeDL(get_ydl_opts({"quiet": True, "no_warnings": True})) as ydl:
        info = ydl.extract_info(url, download=False)

    title = info.get("title", "video")
    filename = sanitize_filename(title)

    # Use simpler format selection that's more reliable
    # Prefer combined formats first, then merge if needed
    format_str = (
        f"best[height<={height}][ext=mp4]/"
        f"bestvideo[height<={height}]+bestaudio/best"
    )

        "ignoreerrors": False,
    })

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.extract_info(url, download=True)

    return {
        "filename": f"{filename}.mp4",
        "title": title,
    }


def cleanup_old_files(max_age_hours: int = 1):
    """Remove files older than max_age_hours."""
    import time
    now = time.time()
    for file in DOWNLOADS_DIR.iterdir():
        if file.is_file():
            age_hours = (now - file.stat().st_mtime) / 3600
            if age_hours > max_age_hours:
                file.unlink()
