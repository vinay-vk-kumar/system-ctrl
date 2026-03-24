import { NextResponse } from "next/server";
import { connectPm2, listProcesses, disconnectPm2 } from "@/lib/pm2";

export async function GET() {
  try {
    await connectPm2();
    const list = await listProcesses();
    const formattedList = list.map((p) => ({
      id: p.pm_id,
      name: p.name,
      status: p.pm2_env?.status || "unknown",
      cpu: p.monit?.cpu || 0,
      memory: p.monit?.memory || 0, // bytes
      uptime: p.pm2_env?.pm_uptime ? Date.now() - p.pm2_env.pm_uptime : 0, // ms
      restarts: p.pm2_env?.restart_time || 0,
      pid: p.pid,
    }));
    disconnectPm2();
    return NextResponse.json({ processes: formattedList });
  } catch (error) {
    console.error("PM2 fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch PM2 processes" }, { status: 500 });
  }
}
