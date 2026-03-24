import { NextResponse } from "next/server";
import si from "systeminformation";

export async function GET() {
  try {
    const [cpu, currentLoad, mem, disk, time, networkStats] = await Promise.all([
      si.cpu(),
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.time(),
      si.networkStats(),
    ]);

    // Calculate main disk usage
    const mainDisk = disk.length > 0 ? disk[0] : null;

    return NextResponse.json({
      cpu: {
        manufacturer: cpu.manufacturer,
        brand: cpu.brand,
        speed: cpu.speed,
        cores: cpu.cores,
        usage: currentLoad.currentLoad.toFixed(2), // overall usage %
        perCore: currentLoad.cpus.map((c) => c.load.toFixed(2)),
      },
      memory: {
        total: mem.total,
        free: mem.free,
        used: mem.active,
        usagePercent: ((mem.active / mem.total) * 100).toFixed(2),
      },
      disk: mainDisk
        ? {
          total: mainDisk.size,
          used: mainDisk.used,
          free: mainDisk.size - mainDisk.used,
          usagePercent: mainDisk.use.toFixed(2),
          fs: mainDisk.fs,
        }
        : null,
      load: {
        avg1: currentLoad.avgLoad ? currentLoad.avgLoad.toFixed(2) : "0",
        // Note: systeminformation provides currentLoad, we can use os.loadavg() for 1, 5, 15 min if needed
      },
      uptime: time.uptime,
      network: networkStats.length > 0 ? {
        interface: networkStats[0].iface,
        rx_sec: networkStats[0].rx_sec,
        tx_sec: networkStats[0].tx_sec,
        rx_bytes: networkStats[0].rx_bytes,
        tx_bytes: networkStats[0].tx_bytes,
      } : null,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("System Metrics Error:", error);
    return NextResponse.json({ error: "Failed to fetch system metrics" }, { status: 500 });
  }
}
