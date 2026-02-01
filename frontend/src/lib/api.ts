const API_BASE = import.meta.env.PUBLIC_API_URL;

export interface VideoFormat {
  format_id: string;
  ext: string;
  resolution: string;
  filesize: number | null;
}

export interface VideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  formats: VideoFormat[];
}

export interface DownloadResult {
  url: string;
  title: string;
  ext: string;
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

export async function getDownloadUrl(
  url: string,
  formatId: string,
): Promise<DownloadResult> {
  const response = await fetch(`${API_BASE}/download`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, format_id: formatId }),
  });
  if (!response.ok) {
    throw new Error("Failed to get download URL");
  }
  return response.json();
}
