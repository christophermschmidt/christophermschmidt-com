import Link from "next/link";
import type { LeadershipCase } from "@/lib/executive-content";
import { Arrow, Closing, PageHero } from "./primitives";

export function LeadershipCasePage({ item }: { item: LeadershipCase }) {
  return <>
    <PageHero eyebrow={`${item.organization} / ${item.context}`} title={item.title} intro={item.introduction} />
    <section className="case-facts"><div className="wrap fact-grid">{item.facts.map((fact) => <div className="fact" key={fact.label}><strong>{fact.value}</strong><span>{fact.label}</span></div>)}</div></section>
    <section className="section light"><div className="wrap article-layout">
      <aside className="side-note" aria-label="Case scope"><div><h2>Mandate</h2><p>{item.mandate}</p></div><div><h2>My responsibility</h2><p>{item.responsibility}</p></div><div><h2>Organizational scale</h2><p>{item.organizationalScale}</p></div></aside>
      <article className="prose executive-prose">
        {item.sections.map((section) => <section key={section.title}><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.items && <ul>{section.items.map((entry) => <li key={entry}>{entry}</li>)}</ul>}</section>)}
        <blockquote className="principle-callout"><p>{item.lesson}</p></blockquote>
        {item.measurementLimitations && <div className="qualification"><h2>Measurement boundary</h2><p>{item.measurementLimitations}</p></div>}
        <div className="next-case"><div><span className="eyebrow">Continue</span><h3>Explore the other leadership cases</h3></div><Link href="/work" className="text-link">Leadership work <Arrow /></Link></div>
      </article>
    </div></section><Closing />
  </>;
}
