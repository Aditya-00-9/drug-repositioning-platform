# Drug data sheets

Drugs are **loaded from these CSV files** at runtime. The app does **not** send the full drug list to the AI prompt — only the user’s search query or the single drug they’re viewing is used.

## Files

- **drugs.csv** — one row per drug  
  Columns: `id`, `name`, `approved_uses`, `summary`, `last_updated`  
  - `approved_uses`: semicolon-separated (e.g. `Use A; Use B`)
  - Use quotes around any value that contains commas

- **drug_evidence.csv** — one row per evidence record  
  Columns: `drug_id`, `title`, `source`, `year`, `link`, `tier`, `notes`, `quality`  
  - `source`: `PubMed` or `ClinicalTrials.gov`  
  - `tier`: `Approved`, `Supportive`, or `Investigational`  
  - `quality` (optional): e.g. `RCT`, `Meta-analysis`, `Systematic Review`

## Editing

1. Edit the CSVs in Excel, Google Sheets (export as CSV), or any text editor.
2. Save in this folder. No restart needed for the next request — the API reads the files on each request.

## Adding a drug

1. Add a row to **drugs.csv** with `id`, `name`, `approved_uses`, `summary`, `last_updated`.
2. Add rows to **drug_evidence.csv** with `drug_id` matching the drug’s `id`, plus evidence fields.
