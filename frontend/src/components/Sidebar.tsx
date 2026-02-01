import { Home, Settings, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Sidebar() {
  return (
    <TooltipProvider>
      <aside className="fixed left-0 top-0 h-screen w-16 bg-foreground border-r border-zinc-900 flex flex-col justify-end pb-6">
        <nav className="flex flex-col items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-3 rounded-lg hover:bg-zinc-900 transition-colors">
                <Home className="w-5 h-5 text-white" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Home</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-3 rounded-lg hover:bg-zinc-900 transition-colors">
                <Info className="w-5 h-5 text-white" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>About</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-3 rounded-lg hover:bg-zinc-900 transition-colors">
                <Settings className="w-5 h-5 text-white" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </nav>
      </aside>
    </TooltipProvider>
  );
}
