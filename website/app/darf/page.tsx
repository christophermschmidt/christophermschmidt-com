import type { Metadata } from "next";
import Link from "next/link";
import { getDarfStructure } from "@/lib/darf";

export const metadata: Metadata = {
  title: "The Data and AI Readiness Framework (DARF)",
  description:
    "DARF answers one question in two parts: can you trust the answer, and can you trust the system to act on it. Two pillars, eight layers, a scored maturity rubric for enterprise AI readiness.",
  alternates: { canonical: "/darf" },
  openGraph: {
    title: "The Data and AI Readiness Framework (DARF)",
    description:
      "Semantic Readiness and Operational Readiness — two pillars, eight layers, a scored maturity rubric for enterprise AI readiness.",
    url: "https://christophermschmidt.com/darf",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  name: "Data and AI Readiness Framework (DARF)",
  alternateName: "DARF",
  description:
    "A two-pillar, eight-layer framework for assessing whether an organization can trust an AI system's answer (Semantic Readiness) and trust it to act on that answer (Operational Readiness).",
  url: "https://christophermschmidt.com/darf",
  creator: {
    "@type": "Person",
    name: "Christopher Schmidt",
    url: "https://christophermschmidt.com",
  },
};

export default function DarfPage() {
  const pillars = getDarfStructure();

  return (
    <div className="max-w-content mx-auto px-6 pt-16 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <p className="text-xs font-semibold tracking-widest text-accent uppercase mb-3">
        Framework
      </p>
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary mb-6">
        The Data and AI Readiness Framework
      </h1>
      <div className="prose mb-14">
        <p>
          DARF exists to answer one question in two parts: <strong>can you
          trust the answer, and can you trust the system to act on it?</strong>{" "}
          Most of what gets sold today as &ldquo;AI readiness&rdquo; blends
          those into a single score. They are two different failure modes, and
          an organization can be excellent at one while being dangerous at the
          other.
        </p>
        <p>
          The two pillars are sequential, not competing. An organization can
          have a flawless semantic layer sitting on zero operational
          readiness — great answers nothing is allowed to safely act on. Or
          governed execution wired to a semantic layer nobody trusts — fast
          action on the wrong thing.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-16">
        {pillars.map((pillar) => (
          <div
            key={pillar.name}
            className="border border-border-default rounded-lg p-6"
          >
            <h2 className="text-lg font-semibold text-text-primary mb-1">
              {pillar.name}
            </h2>
            <p className="text-sm text-text-secondary italic mb-5">
              {pillar.tagline}
            </p>
            <ul className="space-y-3">
              {pillar.layers.map((layer) => (
                <li key={layer.name}>
                  <p className="text-sm font-medium text-text-primary">
                    {layer.name}
                  </p>
                  <p className="text-xs text-text-muted">
                    {layer.capabilities.length} capabilit
                    {layer.capabilities.length === 1 ? "y" : "ies"}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border-default pt-10">
        <h2 className="text-xs font-semibold tracking-widest text-text-muted uppercase mb-4">
          Capability library
        </h2>
        <p className="text-text-secondary leading-relaxed mb-6 max-w-[560px]">
          Every capability across the eight layers has its own page: a
          definition, failure modes, five maturity anchors, a scored
          diagnostic question, the evidence an assessor should request, and
          cited sources.
        </p>
        <Link
          href="/darf/capabilities"
          className="inline-block px-5 py-2.5 bg-accent text-white text-sm font-medium rounded hover:opacity-90 transition-opacity"
        >
          Browse the capability library →
        </Link>
      </div>
    </div>
  );
}
