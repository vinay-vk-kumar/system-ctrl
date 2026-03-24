import { NextResponse } from "next/server";
import { connectPm2, restartProcess, disconnectPm2 } from "@/lib/pm2";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, key } = body;

    if (key !== process.env.RESTART_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectPm2();
    await restartProcess(id);
    disconnectPm2();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PM2 Restart Error:", error);
    return NextResponse.json({ error: "Failed to restart process" }, { status: 500 });
  }
}
