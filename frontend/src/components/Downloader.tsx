import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Downloader() {
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
          placeholder="Paste your YouTube URL here..."
          className="flex-1 h-12 text-base bg-white"
        />
        <Button size="lg" className="h-12 px-6 bg-foreground">
          <Download className="w-5 h-5 mr-2" />
          Download
        </Button>
      </div>
    </div>
  );
}
