import { NextRequest, NextResponse } from "next/server";
import { loadDrugsFromSheet } from "@/app/data/loadFromSheet";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/drugs/[id] — returns one drug from the sheet. Used for profile pages.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const drugs = loadDrugsFromSheet();
    const normalizedId = id?.toLowerCase().trim();
    const drug = drugs.find((d) => d.id === normalizedId);
    if (!drug) {
      return NextResponse.json({ error: "Drug not found" }, { status: 404 });
    }
    return NextResponse.json(drug);
  } catch (e) {
    console.error("GET /api/drugs/[id] error:", e);
    return NextResponse.json(
      { error: "Failed to load drug from sheet." },
      { status: 500 }
    );
  }
}
