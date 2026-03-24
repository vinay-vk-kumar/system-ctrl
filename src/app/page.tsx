"use client";

import React, { useEffect, useState } from "react";
import { StatCard } from "@/components/ui/StatCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { TerminalBox } from "@/components/ui/TerminalBox";
import { Activity, HardDrive, Cpu, Clock, Network } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sysRes, logRes] = await Promise.all([
          fetch("/api/system"),
          fetch("/api/logs?type=nginx")
        ]);
        const sys = await sysRes.json();
        const lgs = await logRes.json();
        
        setData(sys);
        
        if (lgs.logs) {
            setLogs(lgs.logs.slice(-20)); // Limit activity feed to 20 most recent logs
        }

        setHistory(prev => {
          const newHistory = [...prev, {
            time: new Date().toLocaleTimeString(),
            cpu: parseFloat(sys.cpu?.usage || "0"),
            memory: parseFloat(sys.memory?.usagePercent || "0")
          }];
          return newHistory.slice(-20); // Keep last 20 ticks
        });
      } catch (err) {
        console.error("Fetch error", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full">
        <div className="text-neon-green/50 animate-pulse text-2xl tracking-widest uppercase">
          Initializing System...
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 min-h-full flex flex-col gap-6 pb-12">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-cyan uppercase tracking-widest">
            System Overview
          </h1>
          <p className="text-muted-foreground text-sm">Real-time health telemetry</p>
        </div>
        <div className="flex items-center gap-4 text-sm bg-black/50 border border-border px-4 py-2 rounded-sm auto-pulse shadow-[0_0_10px_rgba(0,255,0,0.1)]">
          <span className="text-muted-foreground">Status:</span>
          <span className="text-neon-green font-bold animate-pulse">OK</span>
          <span className="text-muted-foreground ml-4">Uptime:</span>
          <span className="text-foreground">{(data.uptime / 3600).toFixed(2)}h</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="CPU Usage" 
          value={`${data.cpu.usage}%`} 
          icon={Cpu} 
          glowColor={parseFloat(data.cpu.usage) > 80 ? "red" : "cyan"} 
          subValue={`${data.cpu.cores} Cores @ ${data.cpu.speed}GHz`}
        />
        <StatCard 
          title="Memory Usage" 
          value={`${data.memory.usagePercent}%`} 
          icon={Activity} 
          glowColor={parseFloat(data.memory.usagePercent) > 80 ? "red" : "purple"} 
          subValue={`${(data.memory.used / 1024 / 1024 / 1024).toFixed(1)}GB / ${(data.memory.total / 1024 / 1024 / 1024).toFixed(1)}GB`}
        />
        <StatCard 
          title="Disk Space" 
          value={data.disk ? `${data.disk.usagePercent}%` : "N/A"} 
          icon={HardDrive} 
          glowColor="default" 
          subValue={data.disk ? `Free: ${(data.disk.free / 1024 / 1024 / 1024).toFixed(1)}GB` : ""}
        />
        <StatCard 
          title="Network (rx/tx)" 
          value={data.network ? `${(data.network.rx_sec / 1024).toFixed(1)} KB/s` : "N/A"} 
          icon={Network} 
          glowColor="green" 
          subValue={data.network ? `${(data.network.tx_sec / 1024).toFixed(1)} KB/s out` : ""}
        />
      </div>

      {/* Charts & Logs Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ChartCard title="Resource History (CPU & Memory)">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <XAxis dataKey="time" stroke="#30363d" tick={{fill: '#8b949e', fontSize: 10}} />
                <YAxis stroke="#30363d" tick={{fill: '#8b949e', fontSize: 10}} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #30363d', color: '#c9d1d9', borderRadius: '4px' }}
                />
                <Line type="monotone" dataKey="cpu" stroke="#00ffff" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="memory" stroke="#b026ff" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
          
          <div className="grid grid-cols-2 gap-4">
             <StatCard title="Load Avg (1m)" value={data.load.avg1} glowColor="default" />
             <StatCard title="Platform" value={data.cpu.manufacturer} subValue={data.cpu.brand} />
          </div>
        </div>
        
        <div className="h-full flex flex-col min-h-[300px]">
          <TerminalBox title="Activity Feed" logs={logs} className="flex-1" />
        </div>
      </div>
      
    </div>
  );
}
