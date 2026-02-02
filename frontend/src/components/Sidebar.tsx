import { Home, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Sidebar() {
  return (
    <TooltipProvider>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-16 bg-foreground border-r border-zinc-900 flex-col justify-end pb-6">
        <nav className="flex flex-col items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href="/"
                className="p-3 rounded-lg hover:bg-zinc-900 transition-colors"
              >
                <Home className="w-5 h-5 text-white" />
              </a>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Home</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href="/about"
                className="p-3 rounded-lg hover:bg-zinc-900 transition-colors"
              >
                <Info className="w-5 h-5 text-white" />
              </a>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>About</p>
            </TooltipContent>
          </Tooltip>
        </nav>
      </aside>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-foreground border-t border-zinc-900 flex items-center justify-center gap-8 z-50">
        <a
          href="/"
          className="p-3 rounded-lg hover:bg-zinc-900 transition-colors"
        >
          <Home className="w-6 h-6 text-white" />
        </a>
        <a
          href="/about"
          className="p-3 rounded-lg hover:bg-zinc-900 transition-colors"
        >
          <Info className="w-6 h-6 text-white" />
        </a>
      </nav>
    </TooltipProvider>
  );
}
