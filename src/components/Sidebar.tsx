import Link from "next/link";
import { Activity, LayoutDashboard, TerminalSquare, Server } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const links = [
    { href: "/", icon: LayoutDashboard, title: "Dashboard" },
    { href: "/pm2", icon: Activity, title: "PM2 Processes" },
    { href: "/logs", icon: TerminalSquare, title: "Logs" },
    { href: "/services", icon: Server, title: "Services" },
  ];

  return (
    <div className="h-full w-16 group hover:w-64 transition-[width] duration-200 bg-black/95 border-r border-border flex flex-col z-50 fixed left-0 top-0 bottom-0 overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-center group-hover:justify-start min-w-[16rem]">
        <Server className="w-8 h-8 text-neon-purple drop-shadow-[0_0_5px_rgba(176,38,255,0.8)]" />
        <span className="ml-4 font-bold text-lg hidden group-hover:block text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-cyan whitespace-nowrap">
          SYSTEM_CTRL
        </span>
      </div>

      <nav className="flex-1 py-4 flex flex-col gap-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center px-4 py-3 mx-2 rounded-sm text-muted-foreground hover:bg-neon-cyan/10 hover:text-neon-cyan transition-colors group/item"
              title={link.title}
            >
              <Icon className="w-6 h-6 shrink-0 group-hover/item:drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]" />
              <span className="ml-4 hidden group-hover:block whitespace-nowrap uppercase tracking-widest text-sm font-semibold">
                {link.title}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border flex items-center justify-center group-hover:justify-start">
        <div className="w-3 h-3 rounded-full bg-neon-green animate-pulse shadow-[0_0_5px_#00ff00]" />
        <span className="ml-4 hidden group-hover:block text-xs text-muted-foreground font-mono">
          SYSTEM_OK
        </span>
      </div>
    </div>
  );
}
