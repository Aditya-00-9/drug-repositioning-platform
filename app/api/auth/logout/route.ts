import { NextResponse } from "next/server";
import { appendAuditLog } from "@/lib/audit";
import { COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  appendAuditLog({
    action: "auth.logout",
    actor: "session",
    resource: "session",
  });

  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
