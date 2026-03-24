import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  subValue?: string;
  glowColor?: "green" | "red" | "cyan" | "purple" | "default";
}

export function StatCard({ title, value, icon: Icon, subValue, glowColor = "default" }: StatCardProps) {
  const getGlowTextClass = () => {
    switch (glowColor) {
      case "green": return "glow-text-green";
      case "red": return "glow-text-red";
      case "cyan": return "text-[#00ffff] drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]";
      case "purple": return "text-[#b026ff] drop-shadow-[0_0_5px_rgba(176,38,255,0.5)]";
      default: return "";
    }
  };

  return (
    <Card className="glow-border bg-card/80 backdrop-blur border-border rounded-sm relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${getGlowTextClass()}`}>{value}</div>
        {subValue && (
          <p className="text-xs text-muted-foreground mt-1">
            {subValue}
          </p>
        )}
      </CardContent>
      {/* Decorative terminal bracket */}
      <div className="absolute bottom-2 right-2 text-muted-foreground/30 text-xs">_</div>
    </Card>
  );
}
