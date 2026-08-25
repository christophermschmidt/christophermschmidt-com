import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Christopher Schmidt is VP, Solutions Engineering and AI - Enterprise AI at iLink Digital, leading the Microsoft IQ practice, and creator of the Data and AI Readiness Framework (DARF).",
};

export default function AboutPage() {
  return (
    <div className="max-w-content mx-auto px-6 pt-16 pb-24">
      <h1 className="text-2xl font-semibold tracking-tight text-text-primary mb-2">
        About
      </h1>
      <p className="text-sm text-text-muted mb-10">
        VP, Solutions Engineering and AI - Enterprise AI, iLink Digital
      </p>
      <div className="prose">
        <p>
          I&apos;m Christopher Schmidt. I&apos;m VP, Solutions Engineering and
          AI - Enterprise AI at iLink Digital, where I lead the Microsoft IQ
          practice, and I created the{" "}
          <Link href="/darf">Data and AI Readiness Framework (DARF)</Link> — a
          two-pillar model for whether an organization can trust an AI
          system&apos;s answer, and separately, whether it can trust that
          system to act on it.
        </p>
        <p>
          I write{" "}
          <a
            href="https://realtimedispatch.substack.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Real Time Dispatch
          </a>
          , a weekly newsletter covering ontologies, streaming systems,
          event-driven architectures, and the shift from historical reporting
          to embedding analytics directly into business processes. It&apos;s
          also where DARF's ideas get argued in public before they land in
          the framework itself.
        </p>
        <p>
          My work centers on Microsoft Fabric&apos;s Real Time Intelligence
          stack — Eventhouse, Eventstream, Activator, and KQL — and how
          organizations can move from dashboards to action systems that respond
          to events as they happen.
        </p>
        <p>
          Before focusing on real-time systems, I spent years working across
          data warehousing, semantic modeling, and enterprise analytics. That
          background shapes how I think about the tradeoffs between batch and
          streaming, and why most organizations are further from true
          operational intelligence than they realize.
        </p>
        <p>
          I speak at conferences including Microsoft Ignite, SQLBits, and the
          Microsoft Fabric Community Conference — see{" "}
          <Link href="/speaking">Speaking</Link>.
        </p>
      </div>
    </div>
  );
}
