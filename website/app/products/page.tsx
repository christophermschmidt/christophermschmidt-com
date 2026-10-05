import type { Metadata } from "next";
import Link from "next/link";
import { assessmentProduct } from "@/lib/assessment-product";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Practical tools from Christopher Schmidt for assessing data and AI readiness, documenting evidence, and making defensible executive decisions.",
  alternates: { canonical: "/products" },
  openGraph: {
    title: "Products",
    description:
      "Practical tools for assessing data and AI readiness and turning evidence into defensible executive decisions.",
    url: "https://christophermschmidt.com/products",
    type: "website",
  },
};

export default function ProductsPage() {
  return (
    <div className="max-w-content mx-auto px-6 pt-16 pb-24">
      <section className="border-b border-border-default pb-12">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
          Products
        </p>
        <h1 className="mb-5 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Practical tools for evidence-backed decisions
        </h1>
        <p className="max-w-[620px] text-lg leading-relaxed text-text-secondary">
          Tools for leaders and consultants who need to test a readiness claim,
          document the evidence behind it, and decide what should happen next.
        </p>
      </section>

      <section className="py-12">
        <article className="rounded-xl border border-border-default p-6 shadow-sm sm:p-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-muted">
            Executive assessment
          </p>
          <h2 className="mb-4 text-2xl font-semibold tracking-tight text-text-primary">
            <Link
              href="/products/data-ai-readiness"
              className="transition-colors hover:text-accent"
            >
              {assessmentProduct.name}
            </Link>
          </h2>
          <p className="mb-6 max-w-[600px] leading-relaxed text-text-secondary">
            Assess Semantic Readiness and Operational Readiness separately,
            expose evidence gaps, and turn the findings into a practical
            sequence of executive decisions. The download includes an
            interactive Excel assessment and field guide. It also includes
            three completed fictional examples plus editable presentation and
            readout templates.
          </p>
          <div className="mb-6 flex flex-col gap-1 text-sm sm:flex-row sm:gap-6">
            <span className="font-medium text-text-primary">
              {assessmentProduct.price} one-time
            </span>
            <span className="text-text-muted">
              For executives and consultants
            </span>
          </div>
          <Link
            href="/products/data-ai-readiness"
            className="inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            View the {assessmentProduct.name} &rarr;
          </Link>
        </article>
      </section>
    </div>
  );
}
