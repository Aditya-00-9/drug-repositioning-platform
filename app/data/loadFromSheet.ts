/**
 * Load drugs from sheet (CSV). Used by API only — never send full drug list to prompts.
 * The prompt only receives the user's query or the single drug/disease context they asked about.
 */

import { readFileSync } from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import type { DrugProfile, EvidenceRecord } from "./types";

const SHEETS_DIR = path.join(process.cwd(), "app", "data", "sheets");

function escapeCsv(s: string): string {
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function loadDrugsFromSheet(): DrugProfile[] {
  const drugsPath = path.join(SHEETS_DIR, "drugs.csv");
  const evidencePath = path.join(SHEETS_DIR, "drug_evidence.csv");

  let drugsRows: Record<string, string>[];
  let evidenceRows: Record<string, string>[];

  try {
    const drugsCsv = readFileSync(drugsPath, "utf-8");
    drugsRows = parse(drugsCsv, { columns: true, skip_empty_lines: true });
  } catch (e) {
    console.warn("Could not read drugs.csv, falling back to empty list:", e);
    return [];
  }

  try {
    const evidenceCsv = readFileSync(evidencePath, "utf-8");
    evidenceRows = parse(evidenceCsv, { columns: true, skip_empty_lines: true });
  } catch (e) {
    console.warn("Could not read drug_evidence.csv:", e);
    evidenceRows = [];
  }

  const evidenceByDrug = new Map<string, EvidenceRecord[]>();
  for (const row of evidenceRows) {
    const drugId = (row.drug_id ?? "").trim().toLowerCase();
    if (!drugId) continue;
    const source = (row.source === "ClinicalTrials.gov" ? "ClinicalTrials.gov" : "PubMed") as EvidenceRecord["source"];
    const tier = (row.tier === "Approved" || row.tier === "Supportive" || row.tier === "Investigational"
      ? row.tier
      : "Investigational") as EvidenceRecord["tier"];
    const rec: EvidenceRecord = {
      title: (row.title ?? "").trim(),
      source,
      year: parseInt(row.year ?? "0", 10) || 0,
      link: (row.link ?? "").trim(),
      tier,
      notes: (row.notes ?? "").trim() || undefined,
      quality: (row.quality ?? undefined) as EvidenceRecord["quality"] | undefined,
    };
    if (!evidenceByDrug.has(drugId)) evidenceByDrug.set(drugId, []);
    evidenceByDrug.get(drugId)!.push(rec);
  }

  const drugs: DrugProfile[] = drugsRows.map((row) => {
    const id = (row.id ?? "").trim().toLowerCase();
    const approvedUses = (row.approved_uses ?? row.approvedUses ?? "")
      .split(";")
      .map((s: string) => s.trim())
      .filter(Boolean);
    return {
      id,
      name: (row.name ?? "").trim() || id,
      approvedUses,
      evidence: evidenceByDrug.get(id) ?? [],
      summary: (row.summary ?? "").trim(),
      lastUpdated: (row.last_updated ?? row.lastUpdated ?? "").trim(),
    };
  }).filter((d) => d.id);

  return drugs;
}

export { loadDrugsFromSheet, SHEETS_DIR, escapeCsv };
