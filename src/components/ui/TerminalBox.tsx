"use client";

import React, { useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2, Play, Pause, Search, Terminal } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { ScrollArea } from "./scroll-area";
import { cn } from "@/lib/utils";

interface TerminalBoxProps {
  logs: string[];
  title?: string;
  className?: string;
}

export function TerminalBox({ logs, title = "Terminal", className }: TerminalBoxProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [localLogs, setLocalLogs] = useState<string[]>([]);
  
  useEffect(() => {
    if (!isPaused) {
      setLocalLogs(logs);
    }
  }, [logs, isPaused]);

  // Auto-scroll logic
  useEffect(() => {
    if (!isPaused && scrollRef.current) {
        const scrollContainer = scrollRef.current;
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [localLogs, isPaused]);

  const filteredLogs = localLogs.filter((log) => 
    log.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLogColor = (log: string) => {
    if (log.includes("[ERROR]")) return "text-neon-red drop-shadow-[0_0_2px_rgba(255,0,60,0.8)]";
    if (log.includes("[WARN]")) return "text-neon-yellow drop-shadow-[0_0_2px_rgba(255,204,0,0.8)]";
    if (log.includes("[INFO]")) return "text-neon-green drop-shadow-[0_0_2px_rgba(0,255,0,0.8)]";
    return "text-foreground";
  };

  return (
    <div className={cn("flex flex-col border border-border bg-black rounded-sm overflow-hidden glow-border", className)}>
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-card/80 border-b border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-widest font-bold">
          <Terminal className="w-4 h-4 text-neon-green" />
          {title}
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Filter..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-6 w-32 md:w-48 pl-7 text-xs bg-black border-border rounded-sm focus-visible:ring-neon-green/50"
            />
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 hover:bg-white/10"
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? "Resume" : "Pause"}
          >
            {isPaused ? <Play className="w-3 h-3 text-neon-green" /> : <Pause className="w-3 h-3 text-neon-red" />}
          </Button>
        </div>
      </div>
      
      {/* Terminal Body */}
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto text-xs font-mono leading-relaxed scrollbar-hide"
      >
        {filteredLogs.length === 0 ? (
          <div className="text-muted-foreground italic">No logs found...</div>
        ) : (
          filteredLogs.map((log, i) => (
            <div key={i} className={cn("break-words", getLogColor(log))}>
              {log}
            </div>
          ))
        )}
        <div className="flex items-center mt-2 animate-pulse">
            <span className="text-neon-green mr-2">root@server:~$</span>
            <span className="w-2 h-4 bg-neon-green inline-block"></span>
        </div>
      </div>
    </div>
  );
}
