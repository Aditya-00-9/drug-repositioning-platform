import type { AuditLogEntry } from "./types";

const logs: AuditLogEntry[] = [];

export function appendAuditLog(entry: Omit<AuditLogEntry, "id" | "timestamp">): AuditLogEntry {
  const record: AuditLogEntry = {
    ...entry,
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  logs.unshift(record);
  if (logs.length > 500) logs.pop();
  return record;
}

export function getRuntimeAuditLogs(): AuditLogEntry[] {
  return logs;
}
