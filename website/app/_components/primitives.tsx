import Link from "next/link";
import { approachSteps, leadershipCases, type LeadershipCase } from "@/lib/executive-content";

export function Arrow() { return <span aria-hidden="true">→</span>; }

export function CaseCard({ item }: { item: LeadershipCase }) {
  return <Link className="case-card" href={`/work/${item.slug}`} aria-label={`Read ${item.organization}: ${item.title}`}>
    <div className="case-top"><span>{item.organization}</span><span className="case-index">{item.index}</span></div>
    <h3>{item.cardTitle}</h3><p>{item.summary}</p>
    <div className="case-end"><div className="case-metric">{item.metric}</div><div className="case-link"><span>Explore the leadership case</span><Arrow /></div></div>
  </Link>;
}

export function CaseGrid() { return <div className="case-grid">{leadershipCases.map((item) => <CaseCard item={item} key={item.slug} />)}</div>; }

export function ApproachSteps({ open = 0 }: { open?: number }) {
  return <div className="steps">{approachSteps.map(([title, body], index) => <details className="step" key={title} open={index === open}>
    <summary><span className="num">0{index + 1}</span><h3>{title}</h3><span className="plus" aria-hidden="true">+</span></summary>
    <div className="step-body">{body}</div>
  </details>)}</div>;
}

export function Foundations() { return <div className="foundation-strip">
  <div className="foundation-item"><h3>Governance sets the boundary.</h3><p>Define ownership, permitted behavior, operating limits, and the conditions that require review.</p></div>
  <div className="foundation-item"><h3>Auditability explains the decision.</h3><p>Retain the context, evidence, state, and authority needed to reconstruct what happened.</p></div>
  <div className="foundation-item"><h3>Observability reveals operation.</h3><p>Expose behavior, failures, control drift, performance, and cost, then connect a signal to an accountable response.</p></div>
  </div>; }

export function DarfPillars({ full = false }: { full?: boolean }) {
  return <div className={`pillar-pair${full ? " full" : ""}`}>
    <article className="pillar"><div className="pillar-top"><span>01 / SEMANTIC</span><span>27 capabilities</span></div><h3>Semantic<br />Readiness</h3><p className="pillar-question">Can you trust the answer?</p><ul className="layer-list"><li>Semantic Integrity</li><li>Context Stability</li><li>Analytical Explainability</li><li>AI Readiness &amp; Interoperability</li></ul></article>
    <article className="pillar"><div className="pillar-top"><span>02 / OPERATIONAL</span><span>26 capabilities</span></div><h3>Operational<br />Readiness</h3><p className="pillar-question">Can you trust the system to act on it?</p><ul className="layer-list"><li>State</li><li>Policy</li><li>Execution</li><li>Audit</li></ul></article>
  </div>;
}

export function Closing() { return <section className="closing"><div className="wrap closing-inner"><div><span className="eyebrow">Professional connections</span><h2>A conversation about<br />building what matters.</h2><p>For professional connections, speaking, and thoughtful discussion about enterprise technology leadership.</p></div><Link href="/contact" className="btn btn-primary">Get in touch <Arrow /></Link></div></section>; }

export function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: React.ReactNode; intro: string }) { return <section className="page-hero"><div className="wrap"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p className="intro">{intro}</p></div></section>; }
