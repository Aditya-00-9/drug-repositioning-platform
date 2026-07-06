"use client";

import { Download } from "lucide-react";

interface DownloadReportButtonProps {
  evidenceSlug: string;
}

export default function DownloadReportButton({ evidenceSlug }: DownloadReportButtonProps) {
  return (
    <a
      href={`/api/evidence/${evidenceSlug}/report`}
      download
      className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 px-4 py-2 text-[11px] font-mono uppercase tracking-[0.2em] text-teal-300 ring-1 ring-teal-500/30 transition-colors hover:bg-teal-500/20"
    >
      <Download size={14} />
      Download evidence report
    </a>
  );
}
