"use client";

import React, { useEffect, useState } from "react";
import { TerminalBox } from "@/components/ui/TerminalBox";

export default function LogsPage() {
  const [activeTab, setActiveTab] = useState<"pm2" | "nginx">("pm2");
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await fetch(`/api/logs?type=${activeTab}`);
      const data = await res.json();
      if (data.logs) {
        setLogs(data.logs);
      }
      setLoading(false);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchLogs();
    const int = setInterval(fetchLogs, 5000);
    return () => clearInterval(int);
  }, [activeTab]);

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-yellow to-neon-red uppercase tracking-widest">
            System Logs
          </h1>
          <p className="text-muted-foreground text-sm">Aggregated telemetry streams</p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab("pm2")}
            className={`px-4 py-2 border text-sm font-bold uppercase tracking-widest rounded-sm transition-all ${
               activeTab === "pm2" 
                ? "border-neon-green text-neon-green shadow-[0_0_10px_rgba(0,255,0,0.3)_inset] bg-neon-green/10"
                : "border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground"
            }`}
          >
            PM2 Core
          </button>
          <button 
            onClick={() => setActiveTab("nginx")}
            className={`px-4 py-2 border text-sm font-bold uppercase tracking-widest rounded-sm transition-all ${
               activeTab === "nginx" 
                ? "border-neon-cyan text-neon-cyan shadow-[0_0_10px_rgba(0,255,255,0.3)_inset] bg-neon-cyan/10"
                : "border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground"
            }`}
          >
            Nginx Proxy
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        {loading ? (
             <div className="flex-1 border border-border bg-black rounded-sm flex items-center justify-center text-neon-green animate-pulse">
                Establishing uplink...
             </div>
        ) : (
            <TerminalBox 
               title={`${activeTab.toUpperCase()} OVERWATCH`} 
               logs={logs} 
               className="flex-1 h-full shadow-[0_0_20px_rgba(0,0,0,0.8)]" 
            />
        )}
      </div>
    </div>
  );
}
