import { Instagram, Twitter } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 left-16 right-0 py-4 px-6">
      <div className="flex items-center justify-between text-white/70 text-sm">
        <p>
          Created with love by <span className="font-semibold">wiar8</span>.
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
        </div>

        <p>© {currentYear} All rights reserved.</p>
      </div>
    </footer>
  );
}
