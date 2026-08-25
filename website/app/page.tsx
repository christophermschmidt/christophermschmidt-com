import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import { formatDate, categoryLabel } from "@/lib/format";

export default function Home() {
  const articles = getAllArticles().slice(0, 5);

  return (
    <div className="max-w-content mx-auto px-6">
      {/* Hero */}
      <section className="pt-20 pb-16 border-b border-border-default">
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary mb-4">
          Christopher Schmidt
        </h1>
        <p className="text-sm text-text-muted mb-5">
          VP, Solutions Engineering and AI - Enterprise AI, iLink Digital
        </p>
        <p className="text-lg text-text-secondary leading-relaxed max-w-[560px]">
          I write on ontologies, knowledge graphs, and real-time intelligence
          in Microsoft Fabric — the shift from historical analytics to
          embedding data into business processes. I created the{" "}
          <Link href="/darf" className="text-accent hover:underline">
            Data and AI Readiness Framework (DARF)
          </Link>
          , a two-pillar model for whether you can trust an AI system&apos;s
          answer, and whether you can trust it to act on that answer.
        </p>
      </section>

      {/* DARF */}
      <section className="pt-12 pb-16 border-b border-border-default">
        <h2 className="text-xs font-semibold tracking-widest text-text-muted uppercase mb-4">
          Framework
        </h2>
        <p className="text-text-secondary leading-relaxed mb-6 max-w-[560px]">
          <strong className="text-text-primary">
            The Data and AI Readiness Framework (DARF)
          </strong>{" "}
          — Semantic Readiness and Operational Readiness, eight layers, a
          scored maturity rubric. This is the canonical, current version of
          the framework.
        </p>
        <Link
          href="/darf"
          className="text-sm text-accent hover:underline"
        >
          Explore DARF →
        </Link>
      </section>

      {/* Recent writing */}
      <section className="pt-12 pb-16 border-b border-border-default">
        <h2 className="text-xs font-semibold tracking-widest text-text-muted uppercase mb-8">
          Recent Writing
        </h2>
        <ul className="space-y-7">
          {articles.map((article) => (
            <li
              key={article.slug}
              className="grid grid-cols-[8rem_1fr] gap-6 sm:gap-8"
            >
              <span className="text-sm text-text-muted pt-px tabular-nums">
                {formatDate(article.date)}
              </span>
              <div>
                <Link
                  href={`/articles/${article.slug}`}
                  className="text-text-primary hover:text-accent transition-colors font-medium leading-snug"
                >
                  {article.title}
                </Link>
                {article.category && (
                  <p className="mt-1">
                    <span className="text-xs text-text-muted">
                      {categoryLabel(article.category)}
                    </span>
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <Link
            href="/articles"
            className="text-sm text-accent hover:underline"
          >
            All writing →
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="pt-12 pb-24">
        <h2 className="text-xs font-semibold tracking-widest text-text-muted uppercase mb-4">
          Newsletter
        </h2>
        <p className="text-text-secondary leading-relaxed mb-6 max-w-[480px]">
          The Real Time Dispatch goes out weekly on Substack — covering
          Eventhouse, Eventstream, KQL, and the shift from dashboards to
          action systems.
        </p>
        <a
          href="https://realtimedispatch.substack.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-5 py-2.5 bg-accent text-white text-sm font-medium rounded hover:opacity-90 transition-opacity"
        >
          Subscribe on Substack
        </a>
        <p className="mt-4 text-sm text-text-muted">
          Also on{" "}
          <a
            href="https://www.linkedin.com/newsletters/the-real-time-dispatch-7368234962522755072/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            LinkedIn
          </a>{" "}
          as a shorter native excerpt.
        </p>
      </section>
    </div>
  );
}
