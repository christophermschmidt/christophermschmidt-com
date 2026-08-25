import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import { formatDate, categoryLabel } from "@/lib/format";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writing",
};

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <div className="max-w-content mx-auto px-6 pt-16 pb-24">
      <h1 className="text-2xl font-semibold tracking-tight text-text-primary mb-12">
        Writing
      </h1>
      <ul className="divide-y divide-border-default">
        {articles.map((article) => (
          <li
            key={article.slug}
            className="grid grid-cols-[8rem_1fr] gap-6 sm:gap-8 py-7"
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
                <p className="mt-1.5">
                  <span className="text-xs text-text-muted">
                    {categoryLabel(article.category)}
                  </span>
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
