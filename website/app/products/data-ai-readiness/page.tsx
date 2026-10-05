import type { Metadata } from "next";
import Link from "next/link";
import { assessmentProduct } from "@/lib/assessment-product";

export const metadata: Metadata = {
  title: "Data and AI Readiness Executive Assessment Kit",
  description:
    "A practical, evidence-based assessment kit with a guided Excel workbook, field guide, completed examples, and editable executive readout and presentation templates.",
  alternates: { canonical: "/products/data-ai-readiness" },
  openGraph: {
    title: "Data and AI Readiness Executive Assessment Kit",
    description:
      "Assess a defined AI use case across Semantic, AI, and Context profiles, keep evidence gaps visible, and turn the findings into practical executive decisions.",
    url: "https://christophermschmidt.com/products/data-ai-readiness",
    type: "website",
  },
};

const profiles = [
  {
    title: "Semantic",
    body: "Examine whether shared meaning is defined well enough for people and systems to interpret data consistently. The profile focuses on definitions and ownership, with alignment tied back to evidence.",
  },
  {
    title: "AI",
    body: "Examine whether data, controls, and operating practices support the intended AI use. The profile keeps fitness and limits visible, with accountability tied to action.",
  },
  {
    title: "Context",
    body: "Examine whether the surrounding business and operational context can travel with the data. The profile connects interpretation and boundaries to provenance and use.",
  },
];

const kitContents = [
  {
    title: "36-page executive field guide",
    body: "The full assessment guide in editable Word and shareable PDF formats.",
  },
  {
    title: "Four guided Excel workbooks",
    body: "One blank assessment and three completed fictional examples. Each uses a guided six-stage workflow and includes three radar charts.",
  },
  {
    title: "Completed examples",
    body: "Three fictional cases show how different evidence patterns produce different readiness profiles and carry into the executive deliverables.",
  },
  {
    title: "Editable executive presentations",
    body: "A completed 15-slide example and reusable PowerPoint template, each paired with a PDF.",
  },
  {
    title: "Executive readouts",
    body: "A completed one-page readout and reusable template in Word and PDF. The blank PDF includes fillable fields.",
  },
  {
    title: "Start Here guide",
    body: "A concise orientation to the kit, file set, and starting sequence in Word and PDF.",
  },
];

function PurchaseAction({ compact = false }: { compact?: boolean }) {
  if (!assessmentProduct.purchaseUrl) {
    return (
      <div>
        <span
          aria-disabled="true"
          className="inline-flex items-center justify-center rounded-lg border border-border-default bg-border-default/35 px-5 py-2.5 text-sm font-medium text-text-secondary"
        >
          Available after release review
        </span>
        {!compact && (
          <p className="mt-3 max-w-[440px] text-xs leading-relaxed text-text-muted">
            The download is completing workbook and release QA. A purchase link
            will appear here only after the Gumroad product URL is verified.
          </p>
        )}
      </div>
    );
  }

  return (
    <a
      href={assessmentProduct.purchaseUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
    >
      Get the {assessmentProduct.name} for {assessmentProduct.price}
    </a>
  );
}

export default function DataAiReadinessProductPage() {
  return (
    <div className="max-w-content mx-auto px-6 pt-16 pb-24">
      <Link
        href="/products"
        className="mb-8 inline-block text-sm text-text-muted transition-colors hover:text-accent"
      >
        &larr; All products
      </Link>

      <section className="border-b border-border-default pb-14">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
          Executive assessment kit
        </p>
        <h1 className="mb-4 max-w-[660px] text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          {assessmentProduct.name}
        </h1>
        <h2 className="mb-5 max-w-[640px] text-xl font-semibold tracking-tight text-text-primary">
          Turn readiness questions into evidence-backed decisions
        </h2>
        <p className="mb-8 max-w-[640px] text-lg leading-relaxed text-text-secondary">
          Readiness claims become expensive when assumptions quietly turn into
          facts. This kit gives assessment owners a guided way to gather the
          evidence and hold unknowns open. It then connects operating limits to
          the actions and named owners that follow.
        </p>

        <div className="rounded-xl border border-border-default bg-white/35 p-6 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-8">
          <div className="mb-6 sm:mb-0">
            <p className="text-sm font-medium text-text-secondary">
              One-time license for internal and client use
            </p>
            <p className="mt-1 text-3xl font-semibold tracking-tight text-text-primary">
              {assessmentProduct.price}
            </p>
          </div>
          <PurchaseAction />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-text-muted">
          Full refunds are available within 14 days. Questions?{" "}
          <a
            href="mailto:christophermschmidt7@gmail.com"
            className="text-accent hover:underline"
          >
            christophermschmidt7@gmail.com
          </a>
        </p>
      </section>

      <section className="border-b border-border-default py-14">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-muted">
          Three readiness profiles
        </p>
        <h2 className="mb-4 text-2xl font-semibold tracking-tight text-text-primary">
          Keep three different questions separate
        </h2>
        <p className="mb-8 max-w-[620px] leading-relaxed text-text-secondary">
          Semantic, AI, and Context readiness describe different conditions.
          The workbook keeps them separate so one strong area does not conceal
          a limit in another. Each profile is tied back to evidence and to the
          defined use case being assessed.
        </p>
        <div className="grid gap-5 sm:grid-cols-3">
          {profiles.map((profile, index) => (
            <article
              key={profile.title}
              className="rounded-lg border border-border-default p-5"
            >
              <p className="mb-3 font-mono text-xs text-accent">
                0{index + 1}
              </p>
              <h3 className="mb-3 text-base font-semibold leading-snug text-text-primary">
                {profile.title}
              </h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                {profile.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-8 border-b border-border-default py-14 sm:grid-cols-2">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-muted">
            Evidence gaps
          </p>
          <h2 className="mb-4 text-xl font-semibold tracking-tight text-text-primary">
            Missing evidence is its own finding
          </h2>
          <p className="leading-relaxed text-text-secondary">
            A missing artifact is not automatically proof of low maturity, and
            a confident interview answer is not proof of high maturity. The
            assessment keeps capability maturity separate from evidence status
            so leaders can see where the organization needs remediation and
            where it first needs verification.
          </p>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-muted">
            Executive decisions
          </p>
          <h2 className="mb-4 text-xl font-semibold tracking-tight text-text-primary">
            The output is a decision sequence
          </h2>
          <p className="leading-relaxed text-text-secondary">
            The readout helps leaders decide what evidence to collect and which
            prerequisite to fix first. It also shows where human review must
            remain and which actions should not yet be automated. It turns a
            readiness conversation into a bounded plan without pretending every
            gap has the same risk or urgency.
          </p>
        </div>
      </section>

      <section className="border-b border-border-default py-14">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-muted">
          Included in the download
        </p>
        <h2 className="mb-8 text-2xl font-semibold tracking-tight text-text-primary">
          One kit for the assessment and the conversation after it
        </h2>
        <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
          {kitContents.map((item) => (
            <article key={item.title}>
              <h3 className="mb-2 text-base font-semibold text-text-primary">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-b border-border-default py-14">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-muted">
          License
        </p>
        <h2 className="mb-4 text-xl font-semibold tracking-tight text-text-primary">
          Use it with your organization and your clients
        </h2>
        <p className="max-w-[640px] leading-relaxed text-text-secondary">
          Your one-time purchase covers internal use and client engagements. It
          does not permit reselling or redistributing the blank templates as a
          standalone product.
        </p>
      </section>

      <section className="py-14">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-muted">
          Scope
        </p>
        <h2 className="mb-4 text-xl font-semibold tracking-tight text-text-primary">
          A structured assessment, not a certification
        </h2>
        <p className="mb-8 max-w-[640px] leading-relaxed text-text-secondary">
          This kit does not certify an organization, guarantee an implementation
          outcome, or replace experienced consulting judgment. It provides a
          shared method, explicit evidence expectations, and editable materials
          for making the assessment reviewable. Its conclusion still depends on
          the use case, the evidence available, and the people accountable for
          the decision.
        </p>
        <p className="mb-8 max-w-[640px] leading-relaxed text-text-secondary">
          For supporting framework context, see the public{" "}
          <Link href="/darf" className="text-accent hover:underline">
            Data and AI Readiness Framework
          </Link>
          {". "}The kit is the packaged assessment product with the guided workbook
          and executive artifacts.
        </p>
        <PurchaseAction compact />
      </section>
    </div>
  );
}
