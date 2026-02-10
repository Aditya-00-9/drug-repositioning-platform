import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

console.log("CHAT API HIT");
console.log("API KEY EXISTS:", !!process.env.OPENAI_API_KEY);
// System prompt for Deep Research mode — schema must match drug profile UI exactly
const SYSTEM_PROMPT = `
You are a Drug Repurposing Intelligence Engine in DEEP RESEARCH MODE. You output structured JSON only.

RULES:
- Respond with a single JSON object. No markdown, no backticks, no explanation outside the JSON.
- Use only the keys and types below. This format is required for the UI to display correctly.

Required JSON structure (use these exact key names and types):

{
  "snapshot": {
    "drugClass": "string or null",
    "primaryApprovedIndications": ["string"],
    "mechanismsOfAction": ["string"],
    "keyPathways": ["string"],
    "overallConfidence": "Low" | "Medium" | "High"
  },
  "mechanisticRationale": "string (2-4 sentences on mechanism and repurposing rationale)",
  "evidence": {
    "approved": [
      { "indication": "string", "studyType": "string", "summary": "string", "clinicalRelevance": "string" }
    ],
    "supportive": [
      { "strength": "string", "summary": "string", "limitations": "string" }
    ],
    "investigational": [
      { "status": "string", "summary": "string", "translationalPotential": "string" }
    ]
  },
  "evidenceTimeline": [
    "string (e.g. '2005: Initial observational studies...')"
  ],
  "evidenceSummary": {
    "solid": "string",
    "promising": "string",
    "speculative": "string"
  },
  "confidenceAndCaveats": {
    "evidenceGaps": "string",
    "confounders": "string",
    "safetyRisks": "string",
    "regulatoryLimitations": "string",
    "interpretationWarnings": "string"
  },
  "dataSources": ["string"]
}

- snapshot.primaryApprovedIndications: array of approved indication strings (e.g. "Type 2 Diabetes Mellitus").
- snapshot.mechanismsOfAction and keyPathways: arrays of short strings.
- evidence.approved/supportive/investigational: arrays of objects with the exact keys above; use empty arrays [] if none.
- evidenceTimeline: chronological bullets; each item is a single string like "YEAR: finding description".
- evidenceSummary: one sentence or short paragraph each for solid, promising, speculative evidence.
- confidenceAndCaveats: one short sentence each; be conservative and explicit about uncertainty.
- dataSources: list of sources (e.g. "PubMed", "ClinicalTrials.gov", "FDA Drug Database").
`;

// Disease-centric: same JSON shape so the same UI can render; fill fields with disease-relevant content.
const DISEASE_SYSTEM_PROMPT = `
You are a Disease Repurposing Intelligence Engine. You output structured JSON only.

RULES:
- Respond with a single JSON object. No markdown, no backticks, no explanation outside the JSON.
- Use the exact same key names and types as the drug schema below. Interpret them in a disease-centric way.

Required JSON structure (same keys as drug mode):

{
  "snapshot": {
    "drugClass": "string or null (use as: disease class or category, e.g. Metabolic, Neurological)",
    "primaryApprovedIndications": ["string (use as: key phenotypes or indication areas for this disease)"],
    "mechanismsOfAction": ["string (use as: key pathophysiological mechanisms)"],
    "keyPathways": ["string (molecular pathways implicated)"],
    "overallConfidence": "Low" | "Medium" | "High"
  },
  "mechanisticRationale": "string (2-4 sentences on disease biology, unmet need, and repurposing rationale)",
  "evidence": {
    "approved": [{ "indication": "string", "studyType": "string", "summary": "string", "clinicalRelevance": "string" }],
    "supportive": [{ "strength": "string", "summary": "string", "limitations": "string" }],
    "investigational": [{ "status": "string", "summary": "string", "translationalPotential": "string" }]
  },
  "evidenceTimeline": ["string (e.g. '2010: Key pathway discovery...')"],
  "evidenceSummary": { "solid": "string", "promising": "string", "speculative": "string" },
  "confidenceAndCaveats": {
    "evidenceGaps": "string",
    "confounders": "string",
    "safetyRisks": "string",
    "regulatoryLimitations": "string",
    "interpretationWarnings": "string"
  },
  "dataSources": ["string"]
}

- For diseases: snapshot.drugClass = disease category; primaryApprovedIndications = main phenotypes/indications; mechanismsOfAction = pathophysiological mechanisms; keyPathways = pathways. evidence = evidence for repurposing candidates and disease understanding. evidenceTimeline = key milestones for this disease/repurposing. Be conservative and explicit about uncertainty.
`;

/** Attempt to robustly extract a JSON object from the model output. */
function parseModelJSON(output: string): any {
  // First, try a direct parse.
  try {
    return JSON.parse(output);
  } catch {
    // Fall through to cleanup strategies.
  }

  // Strip common markdown fences like ```json ... ``` or ``` ... ```
  const fencedMatch = output.match(/```(?:json)?([\s\S]*?)```/i);
  if (fencedMatch?.[1]) {
    const inner = fencedMatch[1].trim();
    try {
      return JSON.parse(inner);
    } catch {
      // continue
    }
  }

  // Heuristic: grab the first JSON object looking substring.
  const firstBrace = output.indexOf("{");
  const lastBrace = output.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const candidate = output.slice(firstBrace, lastBrace + 1).trim();
    try {
      return JSON.parse(candidate);
    } catch {
      // ignore
    }
  }

  throw new Error("Model returned invalid JSON.");
}

const EMPTY = "";

/** Ensures the deep research response matches the shape the drug profile UI expects. */
function normalizeDeepResearchResponse(parsed: any): any {
  const snap = parsed?.snapshot ?? {};
  const evidence = parsed?.evidence ?? {};
  const safeArr = (v: any): any[] => (Array.isArray(v) ? v : []);
  const safeStr = (v: any): string => (typeof v === "string" ? v : EMPTY);
  const confidenceOpt = (v: any): "Low" | "Medium" | "High" =>
    v === "Low" || v === "Medium" || v === "High" ? v : "Medium";

  const approved = safeArr(evidence.approved).map((e: any) => ({
    indication: safeStr(e?.indication),
    studyType: safeStr(e?.studyType),
    summary: safeStr(e?.summary),
    clinicalRelevance: safeStr(e?.clinicalRelevance),
  }));
  const supportive = safeArr(evidence.supportive).map((e: any) => ({
    strength: safeStr(e?.strength),
    summary: safeStr(e?.summary),
    limitations: safeStr(e?.limitations),
  }));
  const investigational = safeArr(evidence.investigational).map((e: any) => ({
    status: safeStr(e?.status),
    summary: safeStr(e?.summary),
    translationalPotential: safeStr(e?.translationalPotential),
  }));

  const timeline = safeArr(parsed?.evidenceTimeline);
  const summary = parsed?.evidenceSummary ?? {};
  const caveats = parsed?.confidenceAndCaveats ?? {};
  const sources = safeArr(parsed?.dataSources).map((s: any) => (typeof s === "string" ? s : String(s)));

  return {
    snapshot: {
      drugClass: snap.drugClass != null ? String(snap.drugClass) : null,
      primaryApprovedIndications: safeArr(snap.primaryApprovedIndications).map(String),
      mechanismsOfAction: safeArr(snap.mechanismsOfAction).map(String),
      keyPathways: safeArr(snap.keyPathways).map(String),
      overallConfidence: confidenceOpt(snap.overallConfidence),
    },
    mechanisticRationale: safeStr(parsed?.mechanisticRationale),
    evidence: { approved, supportive, investigational },
    evidenceTimeline: timeline,
    evidenceSummary: {
      solid: safeStr(summary.solid),
      promising: safeStr(summary.promising),
      speculative: safeStr(summary.speculative),
    },
    confidenceAndCaveats: {
      evidenceGaps: safeStr(caveats.evidenceGaps),
      confounders: safeStr(caveats.confounders),
      safetyRisks: safeStr(caveats.safetyRisks),
      regulatoryLimitations: safeStr(caveats.regulatoryLimitations),
      interpretationWarnings: safeStr(caveats.interpretationWarnings),
    },
    dataSources: sources,
  };
}

type ClientMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: Request) {
  try {
    // --- Init OpenAI from env (trimmed) ---
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!.trim(),
    });

    // --- Parse request body ---
    let body: { messages?: ClientMessage[]; context?: "drug" | "disease" };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body." },
        { status: 400 }
      );
    }

    const { messages, context } = body;
    const systemPrompt = context === "disease" ? DISEASE_SYSTEM_PROMPT : SYSTEM_PROMPT;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Request must include a non-empty messages array." },
        { status: 400 }
      );
    }

    // --- Sanitize messages ---
    const sanitizedMessages = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // Use the most recent user message as the input
    const userMessage =
      [...sanitizedMessages]
        .reverse()
        .find((m) => m.role === "user")?.content || "";

    // --- Call OpenAI using responses API ---
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    });

    const output =
      // Prefer a direct text helper if available
      // @ts-ignore - depending on SDK version this may or may not exist
      response.output_text ??
      // Fallback to nested output structure
      // @ts-ignore - structure is SDK-version-dependent
      response.output?.[0]?.content?.[0]?.text ??
      "";

    if (!output) {
      return NextResponse.json(
        { error: "No content returned from model." },
        { status: 502 }
      );
    }

    // --- Parse JSON safely, then normalize so the drug profile UI always gets the expected shape ---
    try {
      const parsed = parseModelJSON(output);
      const normalized = normalizeDeepResearchResponse(parsed);
      return NextResponse.json(normalized);
    } catch {
      console.error("❌ MODEL RETURNED INVALID JSON:", output);
      return NextResponse.json(
        { error: "Model returned invalid JSON.", raw: output },
        { status: 502 }
      );
    }
  } catch (err: any) {
    console.error("❌ OPENAI FULL ERROR:", err?.response?.data || err);
    return NextResponse.json(
      { error: "Failed to generate research response." },
      { status: 500 }
    );
  }
}
