import { NextRequest, NextResponse } from "next/server";
import { loadDrugsFromSheet } from "@/app/data/loadFromSheet";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/drugs — returns all drugs loaded from the sheet (CSV).
 * The prompt in /api/chat never receives this list; only the user's query or single drug context is sent.
 */
export async function GET(req: NextRequest) {
  try {
    const drugs = loadDrugsFromSheet();
    const search = req.nextUrl.searchParams.get("search");
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      const filtered = drugs.filter(
        (d) =>
          d.name.toLowerCase().includes(q) || d.id.toLowerCase().includes(q)
      );
      return NextResponse.json(filtered);
    }
    return NextResponse.json(drugs);
  } catch (e) {
    console.error("GET /api/drugs error:", e);
    return NextResponse.json(
      { error: "Failed to load drugs from sheet." },
      { status: 500 }
    );
  }
}
