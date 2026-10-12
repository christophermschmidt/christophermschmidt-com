import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllLocalArticles, getArticleBySlug, isExternalArticleUrl } from "@/lib/articles";
import { formatDateLong, categoryLabel } from "@/lib/format";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return getAllLocalArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  const localUrl = `/articles/${article.slug}`;
  const canonical = isExternalArticleUrl(article.url) ? article.url : localUrl;
  return {
    title: article.title,
    description: article.excerpt || undefined,
    alternates: { canonical },
    openGraph: {
      title: article.title,
      type: "article",
      url: canonical.startsWith("https://") ? canonical : `https://christophermschmidt.com${canonical}`,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();
  const external = isExternalArticleUrl(article.url);

  return (
    <div className="max-w-content mx-auto px-6 pt-16 pb-24">
      <div className="mb-10">
        <div className="flex flex-wrap items-center gap-2 mb-5 text-sm text-text-muted">
          <span>{formatDateLong(article.date)}</span>
          {article.category && (
            <>
              <span>·</span>
              <span>{categoryLabel(article.category)}</span>
            </>
          )}
        </div>
        <h1 className="text-[1.75rem] font-semibold tracking-tight text-text-primary leading-tight">
          {article.title}
        </h1>
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-text-muted border border-border-default px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {external ? (
        <div className="prose original-source-landing">
          {article.excerpt && <p>{article.excerpt}</p>}
          <p>This article is published on The Real Time Dispatch. The original source remains the current version.</p>
          <p><a href={article.url} target="_blank" rel="noopener noreferrer">Read the original article on Substack ↗</a></p>
        </div>
      ) : (
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />
      )}

      <div className="mt-16 pt-8 border-t border-border-default">
        <Link href="/articles" className="text-sm text-accent hover:underline">
          ← All writing
        </Link>
      </div>
    </div>
  );
}
