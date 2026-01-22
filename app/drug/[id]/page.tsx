"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink, Download, CheckCircle2, AlertCircle, FlaskConical } from "lucide-react";
import { getDrugById } from "../../data/pipeline";
import type { DrugProfile, EvidenceRecord, EvidenceTier } from "../../data/types";
import { use } from "react";

function DrugProfilePageClient({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const drug: DrugProfile | undefined = getDrugById(resolvedParams.id);

  if (!drug) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-navy-900 via-black to-black">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-8 text-center">
            <p className="text-lg font-medium text-red-400">Drug not found</p>
            <p className="mt-2 text-sm text-slate-400">ID: {resolvedParams.id}</p>
            <Link
              href="/drug"
              className="mt-6 inline-flex items-center gap-2 text-sm text-teal-300 hover:text-teal-200"
            >
              <ArrowLeft size={16} /> Back to drug list
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const byTier = (tier: EvidenceTier): EvidenceRecord[] =>
    drug.evidence.filter((e) => e.tier === tier);

  const handleExportPDF = () => {
    // Dynamic import to avoid SSR issues
    import("jspdf")
      .then((module) => {
        const jsPDF = module.default || (module as any).jsPDF;
        if (!jsPDF) {
          throw new Error("jsPDF not found in module");
        }
        const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let yPos = margin;

      // Title
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text(drug.name, margin, yPos);
      yPos += 10;

      // Approved uses
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Approved Indications", margin, yPos);
      yPos += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      drug.approvedUses.forEach((use) => {
        doc.text(`• ${use}`, margin + 5, yPos);
        yPos += 6;
      });
      yPos += 5;

      // Evidence sections
      const sections = [
        { tier: "Approved" as EvidenceTier, title: "Approved Evidence" },
        { tier: "Supportive" as EvidenceTier, title: "Supportive Evidence" },
        { tier: "Investigational" as EvidenceTier, title: "Investigational Evidence" },
      ];

      sections.forEach((section) => {
        const evidence = byTier(section.tier);
        if (evidence.length > 0) {
          if (yPos > 250) {
            doc.addPage();
            yPos = margin;
          }
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          doc.text(section.title, margin, yPos);
          yPos += 7;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);

          evidence.forEach((e) => {
            if (yPos > 270) {
              doc.addPage();
              yPos = margin;
            }
            doc.text(e.title, margin + 5, yPos, { maxWidth: pageWidth - margin * 2 - 10 });
            yPos += 6;
            doc.setFontSize(9);
            doc.text(`${e.source} · ${e.year}`, margin + 5, yPos);
            yPos += 5;
            if (e.notes) {
              doc.text(e.notes, margin + 5, yPos, { maxWidth: pageWidth - margin * 2 - 10 });
              yPos += 6;
            }
            yPos += 4;
            doc.setFontSize(10);
          });
          yPos += 5;
        }
      });

      // Summary
      if (yPos > 250) {
        doc.addPage();
        yPos = margin;
      }
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Evidence Summary", margin, yPos);
      yPos += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const summaryLines = doc.splitTextToSize(drug.summary, pageWidth - margin * 2);
      summaryLines.forEach((line: string) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = margin;
        }
        doc.text(line, margin, yPos);
        yPos += 6;
      });

      // Footer
      yPos += 5;
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Last updated: ${drug.lastUpdated}`, margin, yPos);
      yPos += 4;
      doc.text("Prototype data. Not clinical advice. For research purposes only.", margin, yPos);

        doc.save(`${drug.name.replace(/\s+/g, "_")}_Evidence_Report.pdf`);
      })
      .catch((err) => {
        console.error("PDF export failed:", err);
        alert(
          "PDF export requires jspdf. Please install it:\n\nnpm install jspdf\n\nThen refresh the page."
        );
      });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-navy-900 via-black to-black">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.24),_transparent_55%)] opacity-60" />

      <div className="relative mx-auto max-w-6xl px-6 py-24">
        {/* Back link */}
        <Link
          href="/drug"
          className="mb-10 inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.22em] text-slate-500 transition-colors hover:text-teal-300"
        >
          <ArrowLeft size={14} /> Back to drug list
        </Link>

        {/* Header */}
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900/80 text-teal-300 ring-1 ring-slate-700/80">
                <FlaskConical size={22} />
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-50 md:text-4xl">
                  {drug.name}
                </h1>
                <p className="mt-1 text-xs font-mono uppercase tracking-[0.2em] text-slate-500">
                  Evidence intelligence profile
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-400">
              Last updated: <span className="font-mono">{drug.lastUpdated}</span>
            </p>
          </div>

          {/* Export button */}
          <button
            onClick={handleExportPDF}
            className="mt-4 flex h-11 items-center gap-2 rounded-lg border border-slate-700/80 bg-slate-900/80 px-4 text-sm font-medium text-slate-200 ring-1 ring-slate-700/50 transition-all hover:border-teal-500/50 hover:bg-slate-800/80 hover:text-teal-200 hover:ring-teal-500/30 md:mt-0"
          >
            <Download size={16} />
            Export PDF
          </button>
        </div>

        {/* Approved Indications */}
        <section className="mb-12 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-8 shadow-[0_26px_90px_rgba(15,23,42,0.9)]">
          <div className="mb-6 flex items-center gap-3">
            <CheckCircle2 className="text-emerald-400" size={20} />
            <h2 className="text-lg font-semibold text-slate-50">Approved Indications</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {drug.approvedUses.map((use, idx) => (
              <span
                key={idx}
                className="inline-flex items-center rounded-full bg-emerald-950/40 px-4 py-2 text-sm font-medium text-emerald-300 ring-1 ring-emerald-800/50"
              >
                {use}
              </span>
            ))}
          </div>
        </section>

        {/* Evidence Sections */}
        <div className="space-y-8">
          {/* Approved Evidence */}
          {byTier("Approved").length > 0 && (
            <EvidenceSection
              title="Approved Evidence"
              evidence={byTier("Approved")}
              icon={CheckCircle2}
              iconColor="text-emerald-400"
              borderColor="border-emerald-800/50"
              bgColor="bg-emerald-950/20"
            />
          )}

          {/* Supportive Evidence */}
          {byTier("Supportive").length > 0 && (
            <EvidenceSection
              title="Supportive Evidence"
              evidence={byTier("Supportive")}
              icon={AlertCircle}
              iconColor="text-cyan-400"
              borderColor="border-cyan-800/50"
              bgColor="bg-cyan-950/20"
            />
          )}

          {/* Investigational Evidence */}
          {byTier("Investigational").length > 0 && (
            <EvidenceSection
              title="Investigational Evidence"
              evidence={byTier("Investigational")}
              icon={FlaskConical}
              iconColor="text-amber-400"
              borderColor="border-amber-800/50"
              bgColor="bg-amber-950/20"
            />
          )}
        </div>

        {/* Evidence Summary */}
        <section className="mt-12 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-8 shadow-[0_26px_90px_rgba(15,23,42,0.9)]">
          <h2 className="mb-4 text-lg font-semibold text-slate-50">Evidence Summary</h2>
          <p className="leading-relaxed text-slate-300">{drug.summary}</p>
          <div className="mt-6 rounded-lg border border-slate-800/50 bg-slate-900/40 p-4">
            <p className="text-xs leading-relaxed text-slate-500">
              <strong className="text-slate-400">Prototype notice:</strong> This evidence profile
              is manually curated for demonstration purposes. Data is incomplete and not intended
              for clinical decision-making. Citations are representative examples and may not reflect
              the full evidence base.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function DrugProfilePage({ params }: { params: Promise<{ id: string }> }) {
  return <DrugProfilePageClient params={params} />;
}

function EvidenceSection({
  title,
  evidence,
  icon: Icon,
  iconColor,
  borderColor,
  bgColor,
}: {
  title: string;
  evidence: EvidenceRecord[];
  icon: React.ComponentType<{ size?: number; className?: string }>;
  iconColor: string;
  borderColor: string;
  bgColor: string;
}) {
  return (
    <section className={`rounded-2xl border ${borderColor} ${bgColor} p-8 shadow-[0_26px_90px_rgba(15,23,42,0.9)]`}>
      <div className="mb-6 flex items-center gap-3">
        <Icon className={iconColor} size={20} />
        <h2 className="text-lg font-semibold text-slate-50">{title}</h2>
        <span className="ml-auto rounded-full bg-slate-900/80 px-3 py-1 text-xs font-mono uppercase tracking-[0.2em] text-slate-400">
          {evidence.length} {evidence.length === 1 ? "record" : "records"}
        </span>
      </div>

      <div className="space-y-4">
        {evidence.map((e, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-6 transition-all hover:border-slate-700/80 hover:bg-slate-900/60"
          >
            <h3 className="mb-2 text-base font-medium leading-snug text-slate-100">{e.title}</h3>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/80 px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">
                {e.source}
              </span>
              <span className="text-xs text-slate-500">{e.year}</span>
            </div>
            {e.notes && (
              <p className="mb-4 text-sm leading-relaxed text-slate-400">{e.notes}</p>
            )}
            <a
              href={e.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-300 transition-colors hover:text-teal-200"
            >
              View source <ExternalLink size={14} />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
