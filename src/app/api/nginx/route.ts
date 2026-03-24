import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET() {
  try {
    let activeConnections = 0;
    
    if (process.platform === "linux") {
      try {
        const { stdout } = await execAsync("netstat -an | grep -E ':80|:443' | grep ESTABLISHED | wc -l");
         activeConnections = parseInt(stdout.trim()) || 0;
      } catch (e) {
         console.error("Netstat Nginx error:", e);
      }
    } else {
        // Mock data for local windows testing
        activeConnections = Math.floor(Math.random() * 100);
    }

    return NextResponse.json({
      activeConnections,
      status: "running"
    });
  } catch (error) {
    console.error("Nginx fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch Nginx status" }, { status: 500 });
  }
}
