const API_BASE = import.meta.env.PUBLIC_API_URL;

export interface QualityOption {
  height: number;
  label: string;
}

export interface VideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  qualities: QualityOption[];
}

export interface DownloadResult {
  filename: string;
  title: string;
  download_url: string;
}

export async function getVideoInfo(url: string): Promise<VideoInfo> {
  const response = await fetch(
    `${API_BASE}/info?url=${encodeURIComponent(url)}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch video info");
  }
  return response.json();
}

export async function downloadAudio(url: string): Promise<DownloadResult> {
  const response = await fetch(`${API_BASE}/download/audio`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!response.ok) {
    throw new Error("Failed to download audio");
  }
  return response.json();
}

export async function downloadVideo(url: string, height: number): Promise<DownloadResult> {
  const response = await fetch(`${API_BASE}/download/video`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, height }),
  });
  if (!response.ok) {
    throw new Error("Failed to download video");
  }
  return response.json();
}

export function getFileUrl(path: string): string {
  return `${API_BASE}${path}`;
}
