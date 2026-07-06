import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { appendAuditLog } from "@/lib/audit";
import { env } from "@/lib/env";
import { verifySession, COOKIE_NAME } from "@/lib/auth";

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + env.rateLimitWindowMs });
    return true;
  }

  if (entry.count >= env.rateLimitMax) {
    return false;
  }

  entry.count++;
  return true;
}

export async function middleware(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (request.nextUrl.pathname.startsWith("/api/")) {
    if (!checkRateLimit(ip)) {
      appendAuditLog({
        action: "rate_limit.exceeded",
        actor: ip,
        resource: request.nextUrl.pathname,
      });
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }
  }

  if (request.nextUrl.pathname.startsWith("/admin")) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const session = token ? await verifySession(token) : null;

    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();
  response.headers.set("X-Request-Id", crypto.randomUUID());
  return response;
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*"],
};
