import type { Metadata } from "next";
import Link from "next/link";
import { assessmentProduct } from "@/lib/assessment-product";

export const metadata: Metadata = {
  title: "Data and AI Readiness Executive Assessment Kit",
  description:
    "A practical, evidence-based assessment kit for executives and consultants, with an Excel assessment, field guide, completed examples, and editable executive templates.",
  alternates: { canonical: "/darf/assessment" },
  openGraph: {
    title: "Data and AI Readiness Executive Assessment Kit",
    description:
      "Assess Semantic Readiness and Operational Readiness separately, identify evidence gaps, and turn the findings into practical executive decisions.",
    url: "https://christophermschmidt.com/darf/assessment",
    type: "website",
  },
};

const profiles = [
  {
    title: "Trusted answers, constrained action",
    body: "Semantic Readiness is ahead of Operational Readiness. The organization may have dependable definitions and lineage. Its context may be stable. Authority, execution controls, or auditability still limit what an AI system should be allowed to do.",
  },
  {
    title: "Fast action, weak context",
    body: "Operational Readiness is ahead of Semantic Readiness. The system can execute, but the meaning behind its decisions is inconsistent or difficult to verify. This is where speed can make a bad answer more expensive.",
  },
  {
    title: "Evidence-backed balance",
    body: "Both pillars are supported for the use case being assessed. This is not a claim that the organization is universally ready. It means the current scope has enough evidence to justify specific decisions, controls, and next steps.",
  },
];

const kitContents = [
  {
    title: "Executive field guide",
    body: "A practical explanation of the two pillars, the assessment method, and how to read the results without collapsing them into one score.",
  },
  {
    title: "Interactive Excel assessment",
    body: "A working assessment with capability-level maturity and evidence status. It connects prerequisite context to executive outputs.",
  },
  {
    title: "Three completed examples",
    body: "Fictional small, medium, and large enterprise scenarios showing how different evidence and readiness patterns change the conclusion.",
  },
  {
    title: "Editable PowerPoint example and template",
    body: "A presentation format for walking stakeholders through the assessment, findings, and remediation priorities.",
  },
  {
    title: "Standalone executive readout and template",
    body: "A concise deliverable for leaders who need the decisions, evidence gaps, and next actions without the full workbook walkthrough.",
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

export default function DarfAssessmentPage() {
  return (
    <div className="max-w-content mx-auto px-6 pt-16 pb-24">
      <Link
        href="/darf"
        className="mb-8 inline-block text-sm text-text-muted transition-colors hover:text-accent"
      >
        &larr; DARF overview
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
          Most AI readiness assessments end with a single score. That hides the
          decision leaders actually need to make: whether they can trust the
          answer, whether they can trust the system to act on it, and what
          evidence supports either conclusion.
        </p>

        <div className="rounded-xl border border-border-default bg-white/35 p-6 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-8">
          <div className="mb-6 sm:mb-0">
            <p className="text-sm font-medium text-text-secondary">
              One-time purchase for executives and consultants
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
          The shape of the gap matters more than the score
        </h2>
        <p className="mb-8 max-w-[620px] leading-relaxed text-text-secondary">
          The assessment uses the Data and AI Readiness Framework methodology
          to keep Semantic Readiness and Operational Readiness separate. The
          same overall average can hide three materially different situations.
          Each requires a different executive response.
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

      <section className="py-14">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-muted">
          Scope
        </p>
        <h2 className="mb-4 text-xl font-semibold tracking-tight text-text-primary">
          A structured assessment, not a certification
        </h2>
        <p className="mb-8 max-w-[640px] leading-relaxed text-text-secondary">
          The kit does not certify an organization, guarantee an implementation
          outcome, or replace experienced consulting judgment. It provides a
          shared method, explicit evidence expectations, and editable materials
          for making the assessment reviewable. The conclusion still depends on
          the use case, the evidence available, and the people accountable for
          the decision.
        </p>
        <PurchaseAction compact />
      </section>
    </div>
  );
}
