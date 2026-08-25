import type { Metadata } from "next";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Speaking",
};

interface Talk {
  date: string;
  event: string;
  title: string;
  location?: string;
  url?: string;
}

const talks: Talk[] = [
  {
    date: "2026-06-10",
    event: "Microsoft Fabric Community Conference 2026",
    title: "Real-Time Intelligence Patterns in Microsoft Fabric",
    location: "Las Vegas, NV",
  },
  {
    date: "2026-03-20",
    event: "SQLBits 2026",
    title: "Action Systems in Event Driven Architectures",
    location: "London, UK",
  },
  {
    date: "2025-11-14",
    event: "Microsoft Ignite 2025",
    title: "Real-Time Analytics in Microsoft Fabric",
    location: "Chicago, IL",
  },
  {
    date: "2025-09-24",
    event: "Data + AI Summit 2025",
    title: "Knowledge Graphs as Semantic Intent Layers",
    location: "San Francisco, CA",
  },
];

export default function SpeakingPage() {
  return (
    <div className="max-w-content mx-auto px-6 pt-16 pb-24">
      <h1 className="text-2xl font-semibold tracking-tight text-text-primary mb-4">
        Speaking
      </h1>
      <p className="text-text-secondary leading-relaxed mb-12">
        Conference talks and presentations on real-time intelligence,
        event-driven architectures, and knowledge graphs in Microsoft Fabric.
      </p>
      <ul className="divide-y divide-border-default">
        {talks.map((talk, i) => (
          <li key={i} className="grid grid-cols-[8rem_1fr] gap-6 sm:gap-8 py-7">
            <span className="text-sm text-text-muted pt-px tabular-nums">
              {formatDate(talk.date)}
            </span>
            <div>
              <p className="text-text-primary font-medium leading-snug">
                {talk.url ? (
                  <a
                    href={talk.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent transition-colors"
                  >
                    {talk.title}
                  </a>
                ) : (
                  talk.title
                )}
              </p>
              <p className="text-sm text-text-secondary mt-1">{talk.event}</p>
              {talk.location && (
                <p className="text-xs text-text-muted mt-0.5">{talk.location}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
