# The Ultimate YouTube Downloader

A web platform to download YouTube videos in any format and quality. No ads, no spam.

## Stack

- **Backend:** FastAPI + yt-dlp
- **Frontend:** Astro
- **Runtime:** Python 3.14

## Structure

```
├── backend/    # REST API (FastAPI)
├── frontend/   # Web UI (Astro)
```

Monorepo with backend and frontend separated into independent folders.

## Setup

### Backend

1. Create the conda environment:

```bash
conda env create -f environment.yml
```

2. Activate the environment:

```bash
conda activate tuyd
```

3. Run the development server:

```bash
cd backend
fastapi dev main.py
```
