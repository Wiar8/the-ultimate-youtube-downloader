import { useState } from "preact/hooks";
import { getVideoInfo, getDownloadUrl } from "@/lib/api";
import type { VideoInfo } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "Unknown size";
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

export default function Downloader() {
  const [url, setUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [selectedFormat, setSelectedFormat] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [status, setStatus] = useState("");

  const handleFetchInfo = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setStatus("");
    setVideoInfo(null);

    try {
      const info = await getVideoInfo(url);
      setVideoInfo(info);
      setSelectedFormat("");
    } catch (error) {
      setStatus("Failed to fetch video info");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!url.trim() || !selectedFormat) return;

    setDownloading(true);
    setStatus("");

    try {
      const result = await getDownloadUrl(url, selectedFormat);
      window.open(result.url, "_blank");
      setStatus("Download started!");
    } catch (error) {
      setStatus("Failed to get download URL");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div class="space-y-6">
      {/* URL Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>YouTube Downloader</CardTitle>
          <CardDescription>Paste a YouTube URL to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex gap-2">
            <Input
              type="text"
              value={url}
              onInput={(e) => setUrl((e.target as HTMLInputElement).value)}
              placeholder="https://youtube.com/watch?v=..."
              class="flex-1"
            />
            <Button onClick={handleFetchInfo} disabled={loading}>
              {loading ? "Loading..." : "Get Info"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Video Info Section */}
      {videoInfo && (
        <Card>
          <CardHeader>
            <div class="flex gap-4">
              <img
                src={videoInfo.thumbnail}
                alt="Video thumbnail"
                class="w-40 rounded-md"
              />
              <div>
                <CardTitle>{videoInfo.title}</CardTitle>
                <CardDescription>
                  Duration: {formatDuration(videoInfo.duration)}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Select value={selectedFormat} onValueChange={setSelectedFormat}>
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select format..." />
              </SelectTrigger>
              <SelectContent>
                {videoInfo.formats.map((format) => (
                  <SelectItem key={format.format_id} value={format.format_id}>
                    {format.resolution} ({format.ext}) -{" "}
                    {formatFileSize(format.filesize)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleDownload}
              disabled={!selectedFormat || downloading}
              class="w-full"
            >
              {downloading ? "Getting link..." : "Download"}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Status Section */}
      {status && (
        <Card>
          <CardContent class="pt-6">
            <p class="text-center">{status}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
