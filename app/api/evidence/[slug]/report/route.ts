import { NextResponse } from "next/server";
import { appendAuditLog } from "@/lib/audit";
import {
  getEvidenceBySlug,
  getDrugBySlug,
  getDiseaseBySlug,
  getTargetBySlug,
} from "@/lib/data";
import { formatGrade } from "@/lib/grading";
import { formatDate, formatDateTime } from "@/lib/format";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const evidence = getEvidenceBySlug(slug);

  if (!evidence || evidence.reviewStage !== "published") {
    return NextResponse.json({ error: "Evidence not found" }, { status: 404 });
  }

  const drug = getDrugBySlug(evidence.drugSlug);
  const disease = getDiseaseBySlug(evidence.diseaseSlug);
  const target = getTargetBySlug(evidence.targetSlug);

  appendAuditLog({
    action: "evidence.report_download",
    actor: "anonymous",
    resource: slug,
  });

  const report = `
REPOSITIONING INTELLIGENCE — EVIDENCE REPORT
============================================
Generated: ${formatDateTime(new Date().toISOString())}

DISCLAIMER: This report is for research and informational use only.
It is NOT medical advice, diagnosis, or treatment guidance.

DRUG–DISEASE PAIRING
--------------------
Drug:     ${drug?.name ?? evidence.drugSlug}
Disease:  ${disease?.name ?? evidence.diseaseSlug}
Target:   ${target?.name ?? evidence.targetSlug}

EVIDENCE GRADE: ${formatGrade(evidence.grade)}
Confidence Score: ${evidence.confidenceScore}%
Evidence Level: ${evidence.evidenceLevel}
${evidence.phase ? `Trial Phase: ${evidence.phase}` : ""}

MECHANISM
---------
${evidence.mechanism}

OUTCOMES
--------
${evidence.outcomes}

AI SUMMARY (generated ${formatDate(evidence.aiGeneratedAt)})
-----------
${evidence.aiSummary}

KNOWN RISKS
-----------
${drug?.knownRisks.map((r) => `• ${r}`).join("\n") ?? "N/A"}

CITATIONS
---------
${evidence.citations
  .map(
    (c) =>
      `[${c.source.toUpperCase()}] ${c.externalId}: ${c.title}\n  ${c.url}`
  )
  .join("\n\n")}

PUBMED IDs: ${evidence.pubmedIds.join(", ") || "None"}
CLINICAL TRIAL IDs: ${evidence.clinicalTrialIds.join(", ") || "None"}

LAST VERIFIED: ${formatDate(evidence.lastVerified)}
LAST UPDATED:  ${formatDate(evidence.lastUpdated)}
REVIEW STAGE:  ${evidence.reviewStage}

---
Repositioning Intelligence Platform · Research Mode
`.trim();

  return new NextResponse(report, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="evidence-report-${slug}.txt"`,
    },
  });
}
