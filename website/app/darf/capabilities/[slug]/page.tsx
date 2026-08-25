import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllCapabilitySlugs, getCapabilityBySlug } from "@/lib/darf";

export async function generateStaticParams() {
  return getAllCapabilitySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const capability = await getCapabilityBySlug(slug);
  if (!capability) return {};

  return {
    title: capability.title,
    description: `${capability.title} — a DARF capability in ${capability.pillar}, ${capability.layer}.`,
    alternates: { canonical: `/darf/capabilities/${slug}` },
  };
}

export default async function CapabilityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const capability = await getCapabilityBySlug(slug);
  if (!capability) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: capability.title,
    inDefinedTermSet: "https://christophermschmidt.com/darf",
    description: `A capability in the Data and AI Readiness Framework (DARF): ${capability.pillar} / ${capability.layer}.`,
  };

  return (
    <div className="max-w-content mx-auto px-6 pt-16 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/darf/capabilities"
        className="text-sm text-accent hover:underline mb-6 inline-block"
      >
        ← Capability library
      </Link>
      <p className="text-xs font-semibold tracking-widest text-accent uppercase mb-3">
        {capability.pillar} · {capability.layer}
      </p>
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary mb-2">
        {capability.title}
      </h1>
      {capability.prerequisites && (
        <p className="text-sm text-text-muted mb-10">
          Prerequisites: {capability.prerequisites}
        </p>
      )}
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: capability.contentHtml }}
      />
    </div>
  );
}
