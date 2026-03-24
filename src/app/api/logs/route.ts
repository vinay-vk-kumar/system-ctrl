import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import os from "os";

// Helper to tail a file natively
async function tailFile(filePath: string, lines: number = 100): Promise<string[]> {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const allLines = data.split('\n').filter(Boolean);
    return allLines.slice(-lines);
  } catch (e) {
    return [];
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "pm2"; // pm2 | nginx
  const name = searchParams.get("name") || ""; // pm2 process name

  try {
    let logs: string[] = [];

    if (type === "pm2") {
      // By default pm2 logs are in ~/.pm2/logs
      const pm2LogsDir = path.join(os.homedir(), ".pm2", "logs");
      if (name) {
        const outLog = path.join(pm2LogsDir, `${name}-out.log`);
        const errLog = path.join(pm2LogsDir, `${name}-error.log`);
        const [outLines, errLines] = await Promise.all([
          tailFile(outLog, 50),
          tailFile(errLog, 50)
        ]);
        logs = [...outLines.map(l => `[INFO] ${l}`), ...errLines.map(l => `[ERROR] ${l}`)];
      } else {
         const outLog = path.join(pm2LogsDir, `pm2.log`);
         logs = await tailFile(outLog, 100);
      }
    } else if (type === "nginx") {
      const accessLogPath = process.platform === "win32" ? "C:\\nginx\\logs\\access.log" : "/var/log/nginx/access.log";
      const errorLogPath = process.platform === "win32" ? "C:\\nginx\\logs\\error.log" : "/var/log/nginx/error.log";
      
      const [accessLogs, errorLogs] = await Promise.all([
        tailFile(accessLogPath, 50),
        tailFile(errorLogPath, 50)
      ]);
      logs = [...accessLogs.map(l => `[INFO] ${l}`), ...errorLogs.map(l => `[ERROR] ${l}`)];
    }

    return NextResponse.json({ logs });
  } catch (error) {
    console.error("Log fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}
