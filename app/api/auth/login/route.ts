import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { appendAuditLog } from "@/lib/audit";
import { createSession, validateCredentials, COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body as { email?: string; password?: string };

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  const user = validateCredentials(email, password);
  if (!user) {
    appendAuditLog({
      action: "auth.login_failed",
      actor: email,
      resource: "session",
    });
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await createSession(user);
  appendAuditLog({
    action: "auth.login",
    actor: user.email,
    resource: "session",
  });

  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
    path: "/",
  });
  return response;
}
