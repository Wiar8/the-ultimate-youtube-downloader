"""yt-dlp wrapper functions for video downloading."""

import yt_dlp


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
        # Only include formats with video+audio or audio-only
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


def get_download_url(url: str, format_id: str) -> dict:
    """Get direct download URL for a specific format."""
    ydl_opts = {
        "quiet": True,
        "no_warnings": True,
        "format": format_id,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)

    return {
        "url": info.get("url"),
        "title": info.get("title"),
        "ext": info.get("ext"),
    }
