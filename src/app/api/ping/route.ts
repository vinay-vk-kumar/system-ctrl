// src/app/api/ping/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    const start = performance.now();
    // Use HEAD to save bandwidth, fallback to GET if some servers reject HEAD
    const res = await fetch(targetUrl, { 
        method: "GET", 
        signal: AbortSignal.timeout(5000), // 5 seconds timeout
        cache: 'no-store'
    });
    const time = performance.now() - start;

    return NextResponse.json({
      status: res.ok ? "online" : "down",
      statusCode: res.status,
      time: Math.round(time)
    });
  } catch (error) {
    return NextResponse.json({ status: "down", time: -1, error: String(error) });
  }
}
