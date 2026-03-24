import React from "react";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "online" | "stopped" | "restarting" | "error" | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const normStatus = status.toLowerCase();
  
  let bgClass = "bg-muted text-muted-foreground";
  let dotClass = "bg-muted-foreground";

  if (normStatus === "online" || normStatus === "running" || normStatus === "up") {
    bgClass = "bg-neon-green/10 text-neon-green border-neon-green/50 hover:bg-neon-green/20";
    dotClass = "bg-neon-green shadow-[0_0_5px_#00ff00]";
  } else if (normStatus === "stopped" || normStatus === "error" || normStatus === "down") {
    bgClass = "bg-neon-red/10 text-neon-red border-neon-red/50 hover:bg-neon-red/20";
    dotClass = "bg-neon-red shadow-[0_0_5px_#ff003c]";
  } else if (normStatus === "restarting" || normStatus === "warning") {
    bgClass = "bg-neon-yellow/10 text-neon-yellow border-neon-yellow/50 hover:bg-neon-yellow/20";
    dotClass = "bg-neon-yellow shadow-[0_0_5px_#ffcc00]";
  }

  return (
    <Badge variant="outline" className={cn("rounded-sm font-mono uppercase tracking-widest text-[10px] py-0", bgClass)}>
      <span className={cn("w-1.5 h-1.5 rounded-full mr-2 animate-pulse", dotClass)} />
      {status}
    </Badge>
  );
}
