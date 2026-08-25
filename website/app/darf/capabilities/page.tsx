import type { Metadata } from "next";
import Link from "next/link";
import { getDarfStructure } from "@/lib/darf";

export const metadata: Metadata = {
  title: "DARF Capability Library",
  description:
    "Every capability in the Data and AI Readiness Framework, grouped by pillar and layer, with prerequisites and a scored maturity rubric.",
  alternates: { canonical: "/darf/capabilities" },
};

export default function DarfCapabilitiesPage() {
  const pillars = getDarfStructure();

  return (
    <div className="max-w-content mx-auto px-6 pt-16 pb-24">
      <Link
        href="/darf"
        className="text-sm text-accent hover:underline mb-6 inline-block"
      >
        ← DARF overview
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight text-text-primary mb-4">
        DARF Capability Library
      </h1>
      <p className="text-text-secondary leading-relaxed mb-12 max-w-[560px]">
        Capabilities are not independent — most carry a prerequisite, and a
        capability&apos;s maturity score is capped at its lowest
        prerequisite&apos;s score plus one. Root capabilities (no
        prerequisites) are the honest place to start an assessment.
      </p>

      {pillars.map((pillar) => (
        <div key={pillar.name} className="mb-14">
          <h2 className="text-lg font-semibold text-text-primary mb-1">
            {pillar.name}
          </h2>
          <p className="text-sm text-text-secondary italic mb-6">
            {pillar.tagline}
          </p>

          {pillar.layers.map((layer) => (
            <div key={layer.name} className="mb-8">
              <h3 className="text-xs font-semibold tracking-widest text-text-muted uppercase mb-3">
                {layer.name}
              </h3>
              <ul className="divide-y divide-border-default border-t border-b border-border-default">
                {layer.capabilities.map((cap) => (
                  <li
                    key={cap.slug}
                    className="py-3 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1"
                  >
                    <Link
                      href={`/darf/capabilities/${cap.slug}`}
                      className="text-text-primary hover:text-accent transition-colors font-medium text-sm"
                    >
                      {cap.title}
                      {cap.isNew && (
                        <span className="ml-2 text-[10px] uppercase tracking-wide text-accent">
                          New
                        </span>
                      )}
                    </Link>
                    <span className="text-xs text-text-muted">
                      {cap.prerequisites === "—" || !cap.prerequisites
                        ? "Root capability"
                        : `Requires: ${cap.prerequisites}`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
