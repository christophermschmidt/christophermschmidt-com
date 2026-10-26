import type { Metadata } from "next";
import Link from "next/link";
import { contact } from "@/lib/executive-content";

export const metadata: Metadata = {
  title: "Leadership approach",
  description:
    "Christopher Schmidt's executive leadership approach to business transformation, production platforms, and governed AI.",
  alternates: { canonical: "/approach" },
};

const firstHundredDays = [
  {
    days: "01-30",
    title: "Diagnose",
    body: "Understand the business decisions, establish the baseline and assess the team, platform and operating constraints.",
    checkpoint: "A shared view of the problem and the evidence.",
  },
  {
    days: "31-50",
    title: "Align",
    body: "Name accountable owners and agree on the priorities, tradeoffs and work to stop or defer.",
    checkpoint: "Clear ownership and a bounded delivery commitment.",
  },
  {
    days: "51-80",
    title: "Enable",
    body: "Deliver a usable capability against a bounded priority. Put adoption, trusted context and operating controls into the work.",
    checkpoint: "A usable capability with adoption and operating controls in place.",
  },
  {
    days: "81-100",
    title: "Prove",
    body: "Review adoption and outcome evidence against the baseline. Use the findings to shape the next two-quarter roadmap.",
    checkpoint: "An evidence-based decision on what to scale, change or stop.",
  },
] as const;

export default function ApproachPage() {
  return (
    <div className="approach-page">
      <section className="approach-hero" aria-labelledby="approach-title">
        <div className="wrap">
          <span className="eyebrow">Leadership approach</span>
          <h1 id="approach-title">The first 100 days.</h1>
          <div className="approach-hero-bottom">
            <p className="intro">
              Turning data and AI into measurable business outcomes through business transformation,
              production platforms and governed AI.
            </p>
            <a className="text-link" href="#evidence">
              See the evidence <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      <div className="approach-paper">
        <section className="approach-section" id="first-100-days" aria-labelledby="first-100-days-title">
          <div className="wrap">
            <div className="approach-section-heading">
              <span className="eyebrow">01</span>
              <div>
                <h2 id="first-100-days-title">First 100 days</h2>
                <p className="approach-section-intro">
                  The first 100 days establish the business baseline, clarify ownership and test a bounded priority.
                  The checkpoints below guide that work; they are not a commitment to complete an enterprise
                  transformation in 100 days.
                </p>
              </div>
            </div>
            <div className="approach-timeline">
              {firstHundredDays.map((step) => (
                <article className="approach-timeline-row" key={step.days}>
                  <div className="approach-timeline-date"><span>Days</span>{step.days}</div>
                  <div className="approach-timeline-content">
                    <h3>{step.title}</h3>
                    <div>
                      <p>{step.body}</p>
                      <p className="approach-checkpoint"><strong>Checkpoint:</strong> {step.checkpoint}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <p className="approach-timeline-note">
              These are checkpoints, not rigid phase gates. Work can overlap; urgent business, security and
              operational risks are addressed immediately.
            </p>
          </div>
        </section>

        <section className="approach-section approach-evidence" id="evidence" aria-labelledby="evidence-title">
          <div className="wrap">
            <div className="approach-section-heading">
              <span className="eyebrow">02</span>
              <h2 id="evidence-title">Evidence</h2>
            </div>

            <div className="approach-scope" aria-label="Selected leadership scope">
              <div className="approach-scope-item">
                <div className="approach-scope-number">25</div>
                <strong>Direct reports led</strong>
                <p>Microsoft supplier-risk capability</p>
              </div>
              <div className="approach-scope-item">
                <div className="approach-scope-number">200+</div>
                <strong>Matrix / program stakeholders</strong>
                <p>Engineering, architecture &amp; business</p>
              </div>
              <div className="approach-scope-item">
                <div className="approach-scope-number">3 <small>companies</small></div>
                <strong>DARF implementations</strong>
                <p>Within approximately three months</p>
              </div>
            </div>

            <article className="approach-feature">
              <div>
                <p className="approach-org">Microsoft / Enterprise supplier risk</p>
                <h3>Supplier-risk onboarding</h3>
                <p className="approach-body-copy">
                  Separated business-process gaps from analytical limitations. Introduced tiered risk
                  classifications and upstream data-quality accountability to support earlier risk identification in
                  supplier onboarding.
                </p>
                <p className="approach-accountability">
                  <strong>Leadership accountability</strong>
                  Set priorities, align teams and stop work that did not advance the business outcome.
                </p>
              </div>
              <div className="approach-feature-metric">
                <span className="approach-metric-tag">Verified time-to-insight</span>
                <div className="approach-number-flow">
                  <span className="approach-big-number">90+ days</span>
                  <span className="approach-metric-arrow" aria-hidden="true">↓</span>
                  <span className="approach-result-number">&lt;1 week</span>
                </div>
              </div>
            </article>

            <div className="approach-outcomes">
              <article className="approach-outcome">
                <p className="approach-org">Microsoft / Real-time intelligence</p>
                <h3>Customer adoption and associated revenue</h3>
                <p className="approach-outcome-metric">~5 <span>→ ~100 customers</span></p>
                <p className="approach-outcome-metric">&lt;$1M <span>→ ~$15M</span></p>
                <p className="approach-metric-detail">Associated revenue · approximately 24 months</p>
                <p className="approach-body-copy">Aligned engineering, product, sales and partners around customer value.</p>
              </article>
              <article className="approach-outcome">
                <p className="approach-org">Precision eControl / Production SaaS</p>
                <h3>Production-platform modernization</h3>
                <p className="approach-outcome-metric"><span>~90%</span> lower operating costs</p>
                <p className="approach-outcome-metric"><span>&gt;80%</span> better daily pipeline performance</p>
                <p className="approach-metric-detail">Production-platform modernization</p>
                <p className="approach-body-copy">
                  Led modernization supporting pricing, brand compliance and marketplace intelligence.
                </p>
              </article>
            </div>
            <p className="approach-source-note">
              Selected career outcomes from the executive leadership infographic. Figures approximate; revenue is
              associated with the Microsoft adoption program.
            </p>
          </div>
        </section>
      </div>

      <section className="approach-darf" aria-labelledby="approach-darf-title">
        <div className="wrap">
          <div className="approach-darf-heading">
            <div>
              <h2 id="approach-darf-title">DARF</h2>
              <p>Data &amp; AI Readiness Framework</p>
            </div>
            <Link className="text-link" href="/darf">Explore DARF <span aria-hidden="true">→</span></Link>
          </div>
          <div className="approach-trust-grid">
            <div>
              <span className="eyebrow">Semantic readiness</span>
              <h3>Can we trust<br />the answer?</h3>
            </div>
            <div>
              <span className="eyebrow">Operational readiness</span>
              <h3>Can we trust<br />the system to act?</h3>
            </div>
          </div>
        </div>
      </section>

      <section className="approach-contact" aria-labelledby="approach-contact-title">
        <div className="wrap approach-contact-grid">
          <span className="eyebrow">Contact</span>
          <div>
            <h2 id="approach-contact-title">Connect</h2>
            <a className="approach-contact-link" href={`mailto:${contact.email}`}>
              {contact.email} <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
