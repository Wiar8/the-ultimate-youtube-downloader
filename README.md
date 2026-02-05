# The Ultimate YouTube Downloader

A web platform to download YouTube videos and audio. No ads, no spam, no viruses.

## Stack

- **Backend:** FastAPI + yt-dlp + FFmpeg
- **Frontend:** Astro + React + Tailwind CSS

## Setup

### Backend

```bash
cd backend
conda env create -f environment.yml
conda activate tuyd
fastapi dev main.py
```

### Frontend

```bash
cd frontend
bun install
bun dev
```

### Docker
To run with Docker:
```bash
docker compose up -d
```
