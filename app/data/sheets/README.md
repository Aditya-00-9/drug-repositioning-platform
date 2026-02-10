# Drug data sheets

Drugs are **loaded from the approved drugs list** at runtime. The app tries **approved_drugs.xlsx** in the project root first; if that file is missing or invalid, it falls back to **drugs.csv** in this folder. The app does **not** send the full drug list to the AI prompt — only the user's search query or the single drug they're viewing is used.

## Approved drugs list (Excel)

- **approved_drugs.xlsx** (project root) — one row per drug  
  The first sheet is read. Column headers are matched flexibly (case-insensitive, spaces as underscores).  
  Recognized columns: **id**, **name** (or "Drug name"), **approved_uses** (or "Indications" — semicolon- or pipe-separated), **summary**, **last_updated** (or "Updated").  
  If `id` is missing, it is generated from the drug name (lowercase, hyphenated).

## Files

- **drugs.csv** — one row per drug (used when Excel is not present)  
  Columns: `id`, `name`, `approved_uses`, `summary`, `last_updated`  
  - `approved_uses`: semicolon-separated (e.g. `Use A; Use B`)
  - Use quotes around any value that contains commas

- **drug_evidence.csv** — one row per evidence record  
  Columns: `drug_id`, `title`, `source`, `year`, `link`, `tier`, `notes`, `quality`  
  - `source`: `PubMed` or `ClinicalTrials.gov`  
  - `tier`: `Approved`, `Supportive`, or `Investigational`  
  - `quality` (optional): e.g. `RCT`, `Meta-analysis`, `Systematic Review`

## Editing

1. Edit **approved_drugs.xlsx** in the project root for the full approved drugs list, or edit the CSVs in Excel, Google Sheets (export as CSV), or any text editor.
2. Save in place. No restart needed for the next request — the API reads the files on each request.

## Adding a drug

1. Add a row to **approved_drugs.xlsx** (or **drugs.csv**) with `id`, `name`, `approved_uses`, `summary`, `last_updated`.
2. Optionally add rows to **drug_evidence.csv** with `drug_id` matching the drug's `id`, plus evidence fields.
