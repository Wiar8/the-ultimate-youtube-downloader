import { Instagram, Twitter, Github } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="hidden md:block fixed bottom-0 left-16 right-0 py-4 px-6">
      <div className="flex items-center justify-between text-white/70 text-sm">
        <p>
          Created with love by{" "}
          <a
            className="font-semibold"
            href="https://wiar8.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            wiar8
          </a>
          .
        </p>

        <div className="flex items-center gap-4">
          <a
            href="https://twitter.com/wiar_8"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            <Twitter className="w-5 h-5" />
          </a>
          <a
            href="https://instagram.com/wiar_8"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href="https://github.com/wiar8"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>

        <p>© {currentYear} All rights reserved.</p>
      </div>
    </footer>
  );
}
