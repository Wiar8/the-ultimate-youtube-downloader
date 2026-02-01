import { useState } from "react";
import { Download, Loader2, Music, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getVideoInfo, downloadAudio, downloadVideo, getFileUrl } from "@/lib/api";
import type { VideoInfo } from "@/lib/api";

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

type TabType = "video" | "audio";

export default function Downloader() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("video");
  const [selectedQuality, setSelectedQuality] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  const handleFetchInfo = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setError("");

    try {
      const info = await getVideoInfo(url);
      setVideoInfo(info);
      setSelectedQuality("");
      setActiveTab("video");
      setIsModalOpen(true);
    } catch (err) {
      setError("Failed to fetch video info. Please check the URL.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAudio = async () => {
    if (!url.trim()) return;

    setDownloading(true);
    setError("");

    try {
      const result = await downloadAudio(url);
      // Trigger download
      window.open(getFileUrl(result.download_url), "_blank");
      setIsModalOpen(false);
    } catch (err) {
      setError("Failed to download audio");
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadVideo = async () => {
    if (!url.trim() || !selectedQuality) return;

    setDownloading(true);
    setError("");

    try {
      const height = parseInt(selectedQuality);
      const result = await downloadVideo(url, height);
      // Trigger download
      window.open(getFileUrl(result.download_url), "_blank");
      setIsModalOpen(false);
    } catch (err) {
      setError("Failed to download video");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8">
      {/* Hero Text */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif leading-tight text-white">
          No spam, no ads, no viruses,
          <br />
          just&nbsp;
          <i className="font-semibold">"The ultimate youtube downloader"</i>
        </h1>
      </div>

      {/* Input + Button */}
      <div className="w-full max-w-2xl flex gap-3">
        <Input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste your YouTube URL here..."
          className="flex-1 h-12 text-base bg-white"
          onKeyDown={(e) => e.key === "Enter" && handleFetchInfo()}
        />
        <Button
          size="lg"
          className="h-12 px-6 bg-foreground"
          onClick={handleFetchInfo}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Download className="w-5 h-5 mr-2" />
              Download
            </>
          )}
        </Button>
      </div>

      {/* Error Message */}
      {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}

      {/* Video Info Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="line-clamp-2">{videoInfo?.title}</DialogTitle>
            <DialogDescription>
              Duration: {videoInfo && formatDuration(videoInfo.duration)}
            </DialogDescription>
          </DialogHeader>

          {videoInfo && (
            <div className="space-y-4">
              <img
                src={videoInfo.thumbnail}
                alt={videoInfo.title}
                className="w-full rounded-lg"
              />

              {/* Tab Buttons */}
              <div className="flex gap-2">
                <Button
                  variant={activeTab === "video" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setActiveTab("video")}
                >
                  <Video className="w-4 h-4 mr-2" />
                  Video
                </Button>
                <Button
                  variant={activeTab === "audio" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setActiveTab("audio")}
                >
                  <Music className="w-4 h-4 mr-2" />
                  Audio
                </Button>
              </div>

              {/* Video Tab */}
              {activeTab === "video" && (
                <div className="space-y-4">
                  <Select value={selectedQuality} onValueChange={setSelectedQuality}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select quality..." />
                    </SelectTrigger>
                    <SelectContent>
                      {videoInfo.qualities.map((quality) => (
                        <SelectItem
                          key={quality.height}
                          value={quality.height.toString()}
                        >
                          {quality.label} (MP4)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    className="w-full"
                    onClick={handleDownloadVideo}
                    disabled={!selectedQuality || downloading}
                  >
                    {downloading ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <Download className="w-5 h-5 mr-2" />
                    )}
                    {downloading ? "Processing..." : "Download Video"}
                  </Button>
                </div>
              )}

              {/* Audio Tab */}
              {activeTab === "audio" && (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">
                      Best quality audio • MP3 320kbps
                    </p>
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleDownloadAudio}
                    disabled={downloading}
                  >
                    {downloading ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <Music className="w-5 h-5 mr-2" />
                    )}
                    {downloading ? "Processing..." : "Download Audio"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
