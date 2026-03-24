"use client";

import React, { useEffect, useState } from "react";
import { GlowButton } from "@/components/ui/GlowButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TerminalBox } from "@/components/ui/TerminalBox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PM2Process {
  id: number;
  name: string;
  status: string;
  cpu: number;
  memory: number;
  uptime: number;
  restarts: number;
  pid: number;
}

export default function PM2Page() {
  const [processes, setProcesses] = useState<PM2Process[]>([]);
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [restartModal, setRestartModal] = useState<{ id: number; name: string } | null>(null);
  const [restartKey, setRestartKey] = useState("");
  const [restartMsg, setRestartMsg] = useState("");
  const [isRestarting, setIsRestarting] = useState(false);

  const fetchProcesses = async () => {
    try {
      const res = await fetch("/api/pm2");
      const data = await res.json();
      if (data.processes) setProcesses(data.processes);
      setLoading(false);
    } catch {
      // Handle error implicitly
    }
  };

  const fetchLogs = async (name: string) => {
    try {
      const res = await fetch(`/api/logs?type=pm2&name=${name}`);
      const data = await res.json();
      if (data.logs) setLogs(data.logs);
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    fetchProcesses();
    const int = setInterval(fetchProcesses, 5000);
    return () => clearInterval(int);
  }, []);

  useEffect(() => {
    if (selectedProcess) {
      fetchLogs(selectedProcess);
      const int = setInterval(() => fetchLogs(selectedProcess), 5000);
      return () => clearInterval(int);
    }
  }, [selectedProcess]);

  const handleRestartPrompt = (id: number, name: string) => {
    setRestartModal({ id, name });
    setRestartKey("");
    setRestartMsg("");
  };

  const executeRestart = async () => {
    if (!restartModal || !restartKey) {
      setRestartMsg("Key cannot be empty.");
      return;
    }
    
    setIsRestarting(true);
    setRestartMsg("Connecting to daemon...");

    try {
      const response = await fetch("/api/pm2/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: restartModal.id, key: restartKey })
      });
      const data = await response.json();

      if (!response.ok) {
        setRestartMsg(`Failed: ${data.error || "Invalid authentication key."}`);
      } else {
        setRestartMsg("Success! PM2 Process gracefully restarted.");
        fetchProcesses();
        setTimeout(() => {
           setRestartModal(null);
        }, 1500);
      }
    } catch (e) {
      setRestartMsg("Failed to communicate with API.");
    } finally {
      setIsRestarting(false);
    }
  };

  if (loading) {
    return <div className="text-neon-cyan animate-pulse">Scanning Processes...</div>;
  }

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Restart Authorization Modal */}
      {restartModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-card border border-border glow-border p-6 rounded-sm w-[90%] max-w-[400px] flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-neon-red shadow-[0_0_10px_#ff003c]" />
            <h2 className="text-xl font-bold text-neon-red tracking-widest uppercase">Restart Process</h2>
            <p className="text-sm text-muted-foreground">
              Authorize the restart sequence for <strong className="text-foreground">{restartModal.name}</strong>.
            </p>
            <input 
              type="password" 
              className="bg-black border border-border p-2 mt-2 rounded-sm text-foreground font-mono focus:outline-none focus:border-neon-red transition-colors"
              value={restartKey}
              onChange={(e) => setRestartKey(e.target.value)}
              placeholder="Enter RESTART_KEY..."
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && executeRestart()}
            />
            
            <div className="h-6">
              {restartMsg && (
                <span className={`text-xs font-mono tracking-widest uppercase animate-pulse ${restartMsg.includes("Failed") || restartMsg.includes("empty") ? "text-neon-red" : "text-neon-green"}`}>
                  {restartMsg}
                </span>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <GlowButton variant="ghost" onClick={() => setRestartModal(null)} disabled={isRestarting}>
                Abort
              </GlowButton>
              <GlowButton glowColor="red" onClick={executeRestart} disabled={isRestarting}>
                {isRestarting ? "Executing..." : "Confirm Restart"}
              </GlowButton>
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-cyan uppercase tracking-widest">
          Process Runtime
        </h1>
        <p className="text-muted-foreground text-sm">PM2 Managed Services</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">

        {/* Table Area */}
        <div className="lg:col-span-2 border border-border glow-border bg-black rounded-sm overflow-hidden flex flex-col">
          <div className="p-4 bg-card/50 border-b border-border text-sm font-bold tracking-widest uppercase text-muted-foreground flex justify-between items-center">
            <span>Active Instances</span>
            <span className="text-[10px] text-neon-cyan font-mono animate-pulse uppercase border border-neon-cyan/50 px-2 py-0.5 rounded-sm">Polling Active</span>
          </div>
          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader className="bg-muted/20">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="w-[100px] text-neon-cyan">PID</TableHead>
                  <TableHead className="text-neon-cyan">Name</TableHead>
                  <TableHead className="text-neon-cyan">Status</TableHead>
                  <TableHead className="text-neon-cyan text-right">CPU</TableHead>
                  <TableHead className="text-neon-cyan text-right">Memory</TableHead>
                  <TableHead className="text-neon-cyan text-right">Uptime</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground italic">
                      No PM2 processes found
                    </TableCell>
                  </TableRow>
                ) : processes.map((p) => (
                  <TableRow
                    key={p.id}
                    className={`border-border transition-colors hover:bg-neon-cyan/5 cursor-pointer ${selectedProcess === p.name ? 'bg-neon-cyan/10' : ''}`}
                    onClick={() => setSelectedProcess(p.name)}
                  >
                    <TableCell className="font-mono">{p.pid}</TableCell>
                    <TableCell className="font-bold">{p.name}</TableCell>
                    <TableCell><StatusBadge status={p.status} /></TableCell>
                    <TableCell className="text-right font-mono">{p.cpu}%</TableCell>
                    <TableCell className="text-right font-mono">{(p.memory / 1024 / 1024).toFixed(1)} MB</TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">{(p.uptime / 1000 / 60 / 60).toFixed(1)}h</TableCell>
                    <TableCell className="text-right space-x-2" onClick={e => e.stopPropagation()}>
                      <GlowButton glowColor="purple" size="xs" onClick={() => setSelectedProcess(p.name)}>Logs</GlowButton>
                      <GlowButton glowColor="red" size="xs" onClick={() => handleRestartPrompt(p.id, p.name)}>Restart</GlowButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Logs Side Panel */}
        <div className="h-full flex flex-col min-h-[400px]">
          {selectedProcess ? (
            <TerminalBox title={`Logs: ${selectedProcess}`} logs={logs} className="flex-1" />
          ) : (
            <div className="flex-1 border border-border bg-black/50 rounded-sm flex items-center justify-center text-muted-foreground text-sm uppercase tracking-widest text-center px-4">
              Select a process<br />to view live telemetry
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
