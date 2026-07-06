import { NextResponse } from "next/server";
import { getAuditLogs } from "@/lib/data";
import { getRuntimeAuditLogs } from "@/lib/audit";

export async function GET() {
  const seedLogs = getAuditLogs();
  const runtimeLogs = getRuntimeAuditLogs();
  return NextResponse.json({
    logs: [...runtimeLogs, ...seedLogs].slice(0, 100),
    total: seedLogs.length + runtimeLogs.length,
  });
}
