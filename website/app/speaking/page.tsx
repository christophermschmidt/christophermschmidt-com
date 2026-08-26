import type { Metadata } from "next";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Speaking",
};

interface Talk {
  date: string;
  dateLabel?: string;
  event: string;
  title: string;
  location?: string;
  url?: string;
}

const talks: Talk[] = [
  {
    date: "2026-03-19",
    event: "FabCon & SQLCon 2026",
    title: "Implementation Patterns for Fabric Real Time Intelligence",
  },
  {
    date: "2026-03-19",
    event: "FabCon & SQLCon 2026",
    title: "Master Eventhouse Patterns for Real-Time Intelligence at Scale",
  },
  {
    date: "2025-11-13",
    event: "Louisville Data Technology Group",
    title: "Operational Reporting with Microsoft Fabric",
    location: "Louisville, KY",
  },
  {
    date: "2025-10-18",
    event: "SQLSaturday Pittsburgh 2025",
    title:
      "Supercharge your analytics with Microsoft Fabric Real Time Intelligence",
    location: "Pittsburgh, PA",
  },
  {
    date: "2025-08-16",
    event: "Data Saturday Columbus 2025",
    title: "Effortless Data Transformation with Microsoft Fabric",
    location: "Columbus, OH",
  },
  {
    date: "2025-06-27",
    event: "DATACON Seattle 2025",
    title:
      "Supercharge your analytics with Microsoft Fabric Real Time Intelligence",
    location: "Seattle, WA",
  },
  {
    date: "2025-06-27",
    event: "DATACON Seattle 2025",
    title: "Roundtable Discussion: Microsoft Fabric Real Time Intelligence",
    location: "Seattle, WA",
  },
  {
    date: "2025-06-25",
    dateLabel: "Jun 25–26, 2025",
    event: "DATACON Seattle 2025",
    title: "Ask the Experts (booth)",
    location: "Seattle, WA",
  },
  {
    date: "2025-06-24",
    event: "DATACON Seattle 2025",
    title:
      "ETL, KQL, and RTI: Harnessing Data in Motion with Microsoft Fabric",
    location: "Seattle, WA",
  },
  {
    date: "2025-04-22",
    event: "Microsoft Fabric Global Online Conference — North American Edition",
    title: "Operational Reporting with Microsoft Fabric",
    location: "Virtual",
  },
];

export default function SpeakingPage() {
  return (
    <div className="max-w-content mx-auto px-6 pt-16 pb-24">
      <h1 className="text-2xl font-semibold tracking-tight text-text-primary mb-4">
        Speaking
      </h1>
      <p className="text-text-secondary leading-relaxed mb-12">
        Conference and user group talks on Microsoft Fabric Real-Time
        Intelligence, Eventhouse, and event-driven architectures.
      </p>
      <ul className="divide-y divide-border-default">
        {talks.map((talk, i) => (
          <li key={i} className="grid grid-cols-[8rem_1fr] gap-6 sm:gap-8 py-7">
            <span className="text-sm text-text-muted pt-px tabular-nums">
              {talk.dateLabel ?? formatDate(talk.date)}
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
