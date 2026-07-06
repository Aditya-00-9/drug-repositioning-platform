"use client";

import Link from "next/link";
import { Activity, Database, Target } from "lucide-react";

type IconType = "database" | "activity" | "target";

interface PortalCardProps {
  title: string;
  subtitle: string;
  href: string;
  icon: IconType;
}

const iconMap = {
  database: Database,
  activity: Activity,
  target: Target,
};

export default function PortalCard({
  title,
  subtitle,
  href,
  icon,
}: PortalCardProps) {
  const Icon = iconMap[icon];

  return (
    <Link
      href={href}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-b from-slate-900/60 via-navy-900/80 to-black/90 p-[1px] shadow-[0_22px_80px_rgba(15,23,42,0.85)] transition-transform duration-300 hover:-translate-y-1.5"
    >
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.22),_transparent_55%)]" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 to-transparent" />
      </div>
      <div className="relative flex h-full flex-col rounded-[1.4rem] bg-gradient-to-b from-slate-950/80 via-navy-900/85 to-black/90 p-7">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900/80 text-teal-300 ring-1 ring-teal-500/40">
              <Icon size={22} />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-mono uppercase tracking-[0.22em] text-slate-400">
                Analysis portal
              </h3>
              <p className="text-lg font-semibold tracking-tight text-slate-50">
                {title}
              </p>
            </div>
          </div>
          <span className="rounded-full bg-slate-900/80 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-teal-300/90 ring-1 ring-slate-700/80">
            Linked evidence
          </span>
        </div>

        <p className="mb-7 max-w-[40ch] text-sm leading-relaxed text-slate-400">
          {subtitle}
        </p>

        <div className="mt-auto flex items-center justify-between pt-4 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-mono uppercase tracking-[0.22em] text-slate-500">
              Explore
            </span>
            <span className="h-px w-10 bg-gradient-to-r from-slate-600/40 via-teal-400/80 to-transparent transition-all duration-300 group-hover:w-16" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-teal-300 group-hover:text-teal-200">
            Open →
          </span>
        </div>
      </div>
    </Link>
  );
}
