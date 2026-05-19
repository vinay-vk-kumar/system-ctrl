"use client";

import React, { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";

// Add your domains here
const DOMAINS_TO_MONITOR = [
  { name: "Health Dashboard", subdomain: "healthcheck" },
  { name: "VeggieMap App", subdomain: "veggiemap" },
  { name: "forge todo", subdomain: "todo" },
  { name: "Brainly App", subdomain: "brainly" },
  // { name: "Admin Portal", subdomain: "admin" },
  // { name: "second brain", subdomain: "secondbrain" },
];

interface DomainStatus {
  id: string;
  name: string;
  url: string;
  status: "online" | "down" | "slow" | "checking...";
  responseTime: string | number;
}

export default function ServicesPage() {
  const [services, setServices] = useState<DomainStatus[]>(
    DOMAINS_TO_MONITOR.map(d => ({
      id: d.subdomain,
      name: d.name,
      url: `https://${d.subdomain}.codewithvin.app`,
      status: "checking...",
      responseTime: "..."
    }))
  );

  const fetchDomainStatus = async () => {
    const promises = DOMAINS_TO_MONITOR.map(async (domain) => {
      const url = `https://${domain.subdomain}.codewithvin.app`;
      try {
        const res = await fetch(`/api/ping?url=${encodeURIComponent(url)}`);
        const data = await res.json();

        let finalStatus: "online" | "down" | "slow" = "down";
        if (data.status === "online") {
          finalStatus = data.time > 800 ? "slow" : "online";
        }

        return {
          id: domain.subdomain,
          name: domain.name,
          url,
          status: finalStatus,
          responseTime: data.status === "online" ? `${data.time}ms` : "timeout"
        };
      } catch (error) {
        return {
          id: domain.subdomain,
          name: domain.name,
          url,
          status: "down",
          responseTime: "error"
        };
      }
    });

    const results = await Promise.all(promises);
    setServices((prev) => results as DomainStatus[]);
  };

  useEffect(() => {
    fetchDomainStatus();
    const int = setInterval(fetchDomainStatus, 500000); // Ping every 5 min
    return () => clearInterval(int);
  }, []);

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">

      <div>
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-purple uppercase tracking-widest">
          Service Registry
        </h1>
        <p className="text-muted-foreground text-sm">Monitoring *.codewithvin.app deployments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {services.map((svc) => {
          const isUp = svc.status === "online";
          const isSlow = svc.status === "slow";
          const isChecking = svc.status === "checking...";

          let borderClass = "border-neon-red shadow-[0_0_15px_rgba(255,0,60,0.2)_inset,0_0_10px_rgba(255,0,60,0.2)]";
          let bgClass = "bg-neon-red/20 animate-pulse";
          let iconClass = "border-neon-red text-neon-red";
          let timeClass = "text-neon-red";

          if (isChecking) {
            borderClass = "border-border";
            bgClass = "bg-transparent";
            iconClass = "border-border text-muted-foreground animate-pulse";
            timeClass = "text-muted-foreground";
          } else if (isUp) {
            borderClass = "hover:border-neon-green hover:shadow-[0_0_15px_rgba(0,255,0,0.1)_inset]";
            bgClass = "bg-neon-green/0 group-hover:bg-neon-green/10 transition-colors";
            iconClass = "border-border text-neon-green";
            timeClass = "text-neon-cyan";
          } else if (isSlow) {
            borderClass = "border-neon-yellow shadow-[0_0_15px_rgba(255,204,0,0.2)_inset]";
            bgClass = "bg-neon-yellow/10";
            iconClass = "border-neon-yellow text-neon-yellow";
            timeClass = "text-neon-yellow";
          }

          return (
            <Card
              key={svc.id}
              className={cn(
                "bg-card/80 border-border rounded-sm relative overflow-hidden transition-all duration-300 group",
                borderClass
              )}
            >
              <div className={cn(
                "absolute inset-0 opacity-10 pointer-events-none",
                bgClass
              )} />

              <CardHeader className="flex flex-row items-start justify-between pb-2 z-10 relative">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-sm bg-black border", iconClass)}>
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-foreground tracking-wide truncate max-w-[150px] sm:max-w-[200px]">
                      {svc.name}
                    </CardTitle>
                    <p className="text-[10px] sm:text-xs text-muted-foreground font-mono mt-1 break-all">
                      {svc.url.replace("https://", "")}
                    </p>
                  </div>
                </div>
                <StatusBadge status={isChecking ? "checking" : isUp ? "online" : isSlow ? "warning" : "down"} />
              </CardHeader>

              <CardContent className="z-10 relative pt-4 flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Response Time</span>
                  <span className={cn("font-mono font-bold", timeClass)}>
                    {svc.responseTime}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

    </div>
  );
}
