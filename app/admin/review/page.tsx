import Link from "next/link";
import EntityPageLayout from "@/app/components/EntityPageLayout";
import ReviewStatusBadge from "@/app/components/ReviewStatusBadge";
import MedicalDisclaimer from "@/app/components/MedicalDisclaimer";
import { formatDateTime } from "@/lib/format";
import { getReviewQueue, getAuditLogs, getAllEvidence } from "@/lib/data";
import { getSession } from "@/lib/auth";

const WORKFLOW_STAGES = [
  { stage: "ai_draft" as const, label: "1. AI generates draft", description: "Automated evidence synthesis from PubMed, trials, and labels." },
  { stage: "scientific_review" as const, label: "2. Scientific reviewer", description: "Citation validation, mechanism plausibility, evidence tier assignment." },
  { stage: "medical_review" as const, label: "3. Medical reviewer", description: "Clinical accuracy, risk assessment, regulatory positioning." },
  { stage: "published" as const, label: "4. Publish", description: "Record goes live with confidence score and last verified date." },
];

export default async function AdminReviewPage() {
  const session = await getSession();
  const queue = getReviewQueue();
  const auditLogs = getAuditLogs().slice(0, 10);
  const published = getAllEvidence();

  return (
    <EntityPageLayout
      backHref="/"
      backLabel="Back to platform"
      eyebrow="Review workflow"
      title="Evidence review queue"
      description={`Signed in as ${session?.email ?? "reviewer"}. AI draft → scientific review → medical review → publish.`}
    >
      <section className="mb-10">
        <h2 className="text-[11px] font-mono uppercase tracking-[0.24em] text-teal-300/90">
          Workflow pipeline
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          {WORKFLOW_STAGES.map((s) => (
            <div
              key={s.stage}
              className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4"
            >
              <ReviewStatusBadge stage={s.stage} />
              <p className="mt-2 text-sm font-medium text-slate-200">{s.label}</p>
              <p className="mt-1 text-xs text-slate-400">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-[11px] font-mono uppercase tracking-[0.24em] text-teal-300/90">
          Pending review ({queue.length})
        </h2>
        <div className="mt-4 space-y-3">
          {queue.length === 0 ? (
            <p className="text-sm text-slate-400">No items pending review.</p>
          ) : (
            queue.map((item) => (
              <div
                key={item.evidenceSlug}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800/80 bg-slate-950/60 p-4"
              >
                <div>
                  <span className="font-mono text-sm text-slate-200">{item.evidenceSlug}</span>
                  {item.assignedTo && (
                    <p className="mt-1 text-xs text-slate-500">Assigned: {item.assignedTo}</p>
                  )}
                  {item.notes && (
                    <p className="mt-1 text-xs text-slate-400">{item.notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <ReviewStatusBadge stage={item.stage} />
                  <span className="text-[10px] font-mono text-slate-500">
                    {formatDateTime(item.updatedAt)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-[11px] font-mono uppercase tracking-[0.24em] text-teal-300/90">
          Published records ({published.length})
        </h2>
        <ul className="mt-4 space-y-2">
          {published.map((e) => (
            <li key={e.slug}>
              <Link
                href={`/evidence/${e.slug}`}
                className="text-sm text-teal-300 hover:text-teal-200"
              >
                {e.slug}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-[11px] font-mono uppercase tracking-[0.24em] text-teal-300/90">
          Recent audit log
        </h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-800/80">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/80 text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500">
              <tr>
                <th className="px-4 py-2">Time</th>
                <th className="px-4 py-2">Action</th>
                <th className="px-4 py-2">Actor</th>
                <th className="px-4 py-2">Resource</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {auditLogs.map((log) => (
                <tr key={log.id} className="text-slate-300">
                  <td className="px-4 py-2 text-xs text-slate-500">
                    {formatDateTime(log.timestamp)}
                  </td>
                  <td className="px-4 py-2 font-mono text-xs">{log.action}</td>
                  <td className="px-4 py-2 text-xs">{log.actor}</td>
                  <td className="px-4 py-2 text-xs">{log.resource}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <MedicalDisclaimer className="mt-8" />
    </EntityPageLayout>
  );
}
