import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

/**
 * IMPORTANT:
 * - Must run on Node.js (NOT Edge)
 */
export const runtime = "nodejs";

// System prompt: defines strict operating behavior for the
// Drug Repurposing Intelligence Engine (Deep Research Mode).
const SYSTEM_PROMPT = `
You are a Drug Repurposing Intelligence Engine operating in DEEP RESEARCH MODE.

You are NOT a general-purpose chatbot.
You are a research-grade computational assistant for translational biomedical discovery, portfolio evaluation, and evidence-based decision support.

CRITICAL BEHAVIOR:
- Treat every query as a serious biomedical research task.
- Depth > speed, Accuracy > optimism, Structure > verbosity, Transparency > false certainty.
- Use conservative, non-speculative interpretation. Explicitly label uncertainty.

SCOPE:
- Operate across Drugs × Diseases × Molecular Targets.
- Handle drug-centric, disease-centric, target-centric, and mixed queries.
- Your goal is to surface repurposing opportunities, not to give clinical advice.

ALLOWED EVIDENCE SOURCES (CONCEPTUAL):
- PubMed / MEDLINE, ClinicalTrials.gov, DrugBank, PubChem, NCBI, EMBL-EBI,
  FDA / EMA labels, peer-reviewed RCTs, systematic reviews/meta-analyses,
  and large observational cohort studies.

EVIDENCE TIERS (MANDATORY):
1) APPROVED EVIDENCE
2) SUPPORTIVE EVIDENCE
3) INVESTIGATIONAL EVIDENCE

OUTPUT FORMAT (STRICT JSON):
{
  "snapshot": {},
  "mechanisticRationale": "",
  "evidence": {},
  "evidenceTimeline": [],
  "evidenceSummary": {},
  "confidenceAndCaveats": {},
  "dataSources": []
}
`;

type ClientMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(req: NextRequest) {
  try {
    // --- ENV GUARD ---
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY server configuration." },
        { status: 500 }
      );
    }

    // --- Init OpenAI ---
    const openai = new OpenAI({ apiKey });

    // --- Parse request body ---
    let body: { messages?: ClientMessage[] };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body." },
        { status: 400 }
      );
    }

    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Request must include a non-empty messages array." },
        { status: 400 }
      );
    }

    // Only the user's message(s) are sent to the model — we never inject the full drug list or sheet data into the prompt.
    const sanitizedMessages = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // --- Call OpenAI (STABLE VERSION) ---
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // ✅ CORRECT MODEL
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...sanitizedMessages,
      ],
      temperature: 0.2,
    });

    const message = completion.choices[0]?.message?.content;

    if (!message) {
      return NextResponse.json(
        { error: "No content returned from model." },
        { status: 502 }
      );
    }

    // --- Parse JSON safely ---
    let parsed;
    try {
      parsed = JSON.parse(message);
    } catch (jsonErr) {
      console.error("JSON PARSE ERROR:", message);
      return NextResponse.json(
        {
          error: "Model returned invalid JSON.",
          raw: message,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("OPENAI FULL ERROR:", err?.response?.data || err);
    return NextResponse.json(
      { error: "Failed to generate research response." },
      { status: 500 }
    );
  }
}
