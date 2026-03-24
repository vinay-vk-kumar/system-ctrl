import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

export function ChartCard({ title, children }: ChartCardProps) {
  return (
    <Card className="glow-border bg-card/80 backdrop-blur border-border rounded-sm">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-neon-green/50 animate-pulse"></span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        {children}
      </CardContent>
    </Card>
  );
}
