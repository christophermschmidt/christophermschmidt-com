import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import { formatDateLong, categoryLabel } from "@/lib/format";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return { title: article.title };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

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

      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: article.contentHtml }}
      />

      <div className="mt-16 pt-8 border-t border-border-default">
        <Link href="/articles" className="text-sm text-accent hover:underline">
          ← All writing
        </Link>
      </div>
    </div>
  );
}
