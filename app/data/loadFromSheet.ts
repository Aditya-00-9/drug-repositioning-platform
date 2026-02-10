/**
 * Load drugs from the approved drugs list Excel (approved_drugs.xlsx) or fall back to CSV.
 * Used by API only — never send full drug list to prompts.
 */

import { readFileSync, existsSync } from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import * as XLSX from "xlsx";
import type { DrugProfile, EvidenceRecord } from "./types";

const SHEETS_DIR = path.join(process.cwd(), "app", "data", "sheets");
const APPROVED_DRUGS_XLSX = path.join(process.cwd(), "approved_drugs.xlsx");

function escapeCsv(s: string): string {
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/** Normalize Excel header to a key we recognize (id, name, approved_uses, summary, last_updated). */
function normalizeHeader(key: string): string {
  const k = String(key ?? "").trim().toLowerCase().replace(/\s+/g, "_");
  if (k === "id" || k === "drug_id") return "id";
  if (k === "name" || k === "drug_name" || k === "drug") return "name";
  if (k === "approved_uses" || k === "indications" || k === "indication") return "approved_uses";
  if (k === "summary" || k === "description") return "summary";
  if (k === "last_updated" || k === "lastupdated" || k === "updated" || k === "date") return "last_updated";
  return k;
}

/** Get value from a row using normalized keys; support both Excel headers and our names. */
function getRowValue(row: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const v = row[key];
    if (v != null && String(v).trim() !== "") return String(v).trim();
  }
  const raw = row as Record<string, string>;
  for (const [k, v] of Object.entries(raw)) {
    if (v == null) continue;
    const n = normalizeHeader(k);
    if (keys.includes(n) && String(v).trim() !== "") return String(v).trim();
  }
  return "";
}

/** Load drug rows from approved_drugs.xlsx (first sheet). Returns [] if file missing or invalid. */
function loadDrugsFromExcel(): Record<string, string>[] {
  if (!existsSync(APPROVED_DRUGS_XLSX)) return [];
  try {
    // Read as buffer first so we don't hold a file handle; works better when file is open in Excel on Windows
    const buffer = readFileSync(APPROVED_DRUGS_XLSX);
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) return [];
    const sheet = workbook.Sheets[firstSheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" }) as Record<string, unknown>[];
    if (!Array.isArray(rows) || rows.length === 0) return [];
    // Normalize keys so we can use same logic as CSV (id, name, approved_uses, summary, last_updated)
    return rows.map((row) => {
      const normalized: Record<string, string> = {};
      for (const [key, value] of Object.entries(row)) {
        const n = normalizeHeader(key);
        if (value != null && value !== "") normalized[n] = String(value).trim();
      }
      return normalized;
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("Cannot access") || msg.includes("EBUSY") || msg.includes("EACCES")) {
      console.warn("approved_drugs.xlsx is not readable (close it in Excel if open). Falling back to CSV.");
    } else {
      console.warn("Could not read approved_drugs.xlsx, falling back to CSV:", e);
    }
    return [];
  }
}

function loadDrugsFromSheet(): DrugProfile[] {
  const evidencePath = path.join(SHEETS_DIR, "drug_evidence.csv");
  let evidenceRows: Record<string, string>[] = [];
  try {
    const evidenceCsv = readFileSync(evidencePath, "utf-8");
    evidenceRows = parse(evidenceCsv, { columns: true, skip_empty_lines: true });
  } catch (e) {
    console.warn("Could not read drug_evidence.csv:", e);
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

  const toId = (s: string) => s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  let drugsRows: Record<string, string>[] = loadDrugsFromExcel();

  if (drugsRows.length === 0) {
    const drugsPath = path.join(SHEETS_DIR, "drugs.csv");
    try {
      const drugsCsv = readFileSync(drugsPath, "utf-8");
      drugsRows = parse(drugsCsv, { columns: true, skip_empty_lines: true });
    } catch (e) {
      console.warn("Could not read drugs.csv, falling back to empty list:", e);
      return [];
    }
  }

  const drugs: DrugProfile[] = drugsRows.map((row) => {
    const name = getRowValue(row as Record<string, unknown>, "name") || (row.name ?? "").trim();
    let id = getRowValue(row as Record<string, unknown>, "id") || (row.id ?? "").trim().toLowerCase();
    if (!id && name) id = toId(name) || "unknown";
    else if (id) id = id.toLowerCase();
    const approvedUsesStr =
      getRowValue(row as Record<string, unknown>, "approved_uses") ||
      (row.approved_uses ?? row.approvedUses ?? "").trim();
    const approvedUses = approvedUsesStr
      .split(/[;|]/)
      .map((s: string) => s.trim())
      .filter(Boolean);
    const summary = getRowValue(row as Record<string, unknown>, "summary") || (row.summary ?? "").trim();
    const lastUpdated = getRowValue(row as Record<string, unknown>, "last_updated") || (row.last_updated ?? row.lastUpdated ?? "").trim();
    return {
      id,
      name: name || id,
      approvedUses,
      evidence: evidenceByDrug.get(id) ?? [],
      summary,
      lastUpdated,
    };
  }).filter((d) => d.id);

  return drugs;
}

export { loadDrugsFromSheet, SHEETS_DIR, escapeCsv };
