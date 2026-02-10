import { NextResponse } from "next/server";

/**
 * Dev-only: verify what OPENAI_API_KEY the server has loaded.
 * Open http://localhost:3000/api/debug-openai-env in the browser after restarting the server.
 * Remove or disable this route in production.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Only available in development" }, { status: 404 });
  }
  const raw = process.env.OPENAI_API_KEY;
  const trimmed = typeof raw === "string" ? raw.trim() : "";
  const hasLeadingSpace = typeof raw === "string" && raw.length > 0 && raw !== trimmed;
  return NextResponse.json({
    keySet: trimmed.length > 0,
    keyLength: trimmed.length,
    hasLeadingSpace,
    hint: hasLeadingSpace
      ? "BUG: OPENAI_API_KEY has leading/trailing space in .env.local — remove spaces around the value."
      : trimmed.length < 20
        ? "Add OPENAI_API_KEY to .env.local (no space after =) and restart the dev server."
        : "Key is loaded. If you still get 401, create a NEW key at platform.openai.com and replace the value in .env.local.",
  });
}
