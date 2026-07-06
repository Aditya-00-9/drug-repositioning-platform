import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { getPlatformStats } from "@/lib/data";

export async function GET() {
  const stats = getPlatformStats();
  return NextResponse.json({
    status: "healthy",
    environment: env.nodeEnv,
    appEnv: env.isStaging ? "staging" : env.isProduction ? "production" : "development",
    timestamp: new Date().toISOString(),
    stats,
  });
}
