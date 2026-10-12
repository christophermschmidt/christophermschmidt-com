import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const articlesDirectory = path.join(process.cwd(), "..", "articles");
const substackSnapshotPath = path.join(process.cwd(), "data", "substack-posts.json");

export interface ArticleMeta {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  status: string;
  url: string;
  excerpt: string;
  source: "local" | "substack";
}

export interface Article extends ArticleMeta {
  contentHtml: string;
}

function parseFrontmatterDate(value: unknown): string {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString().substring(0, 10);
  return String(value).substring(0, 10);
}

function normalizedTitle(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function getLocalArticles(): ArticleMeta[] {
  if (!fs.existsSync(articlesDirectory)) return [];

  return fs
    .readdirSync(articlesDirectory)
    .filter((name) => name.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fileContents = fs.readFileSync(
        path.join(articlesDirectory, fileName),
        "utf8"
      );
      const { data } = matter(fileContents);
      return {
        slug,
        title: data.title || "",
        date: parseFrontmatterDate(data.date),
        category: data.category || "",
        tags: Array.isArray(data.tags) ? data.tags : [],
        status: data.status || "",
        url: data.url || "",
        excerpt: data.excerpt || "",
        source: "local",
      } as ArticleMeta;
    })
    .filter((a) => a.status === "published");
}

function getSubstackArticles(): ArticleMeta[] {
  if (!fs.existsSync(substackSnapshotPath)) return [];
  const posts = JSON.parse(fs.readFileSync(substackSnapshotPath, "utf8")) as Array<Partial<ArticleMeta>>;
  return posts
    .filter((post) =>
      typeof post.slug === "string" &&
      typeof post.title === "string" &&
      typeof post.date === "string" &&
      typeof post.url === "string" &&
      post.url.startsWith("https://realtimedispatch.substack.com/p/")
    )
    .map((post) => ({
      slug: post.slug!,
      title: post.title!,
      date: post.date!,
      category: post.category || "architecture-strategy",
      tags: [],
      status: "published",
      url: post.url!,
      excerpt: post.excerpt || "",
      source: "substack",
    }));
}

export function isExternalArticleUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname !== "christophermschmidt.com";
  } catch {
    return false;
  }
}

export function getArticleHref(article: ArticleMeta): string {
  return isExternalArticleUrl(article.url) ? article.url : `/articles/${article.slug}`;
}

export function getAllLocalArticles(): ArticleMeta[] {
  return getLocalArticles().sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllArticles(): ArticleMeta[] {
  const local = getLocalArticles();
  const substack = getSubstackArticles();
  const externalUrls = new Set(substack.map((post) => post.url));
  const externalTitles = new Set(substack.map((post) => normalizedTitle(post.title)));
  const uniqueLocal = local.filter((article) =>
    !externalUrls.has(article.url) && !externalTitles.has(normalizedTitle(article.title))
  );
  return [...substack, ...uniqueLocal].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const fullPath = path.join(articlesDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const substackPost = getSubstackArticles().find((post) =>
    post.url === data.url || normalizedTitle(post.title) === normalizedTitle(data.title || "")
  );

  // Strip leading h1 if it duplicates the frontmatter title
  const cleanContent = content.replace(/^\s*#[^#].*\n+/, "");

  const processed = await remark()
    .use(html, { sanitize: false })
    .process(cleanContent);

  return {
    slug,
    title: data.title || "",
    date: parseFrontmatterDate(data.date),
    category: data.category || "",
    tags: Array.isArray(data.tags) ? data.tags : [],
    status: data.status || "",
    url: substackPost?.url || data.url || "",
    excerpt: substackPost?.excerpt || data.excerpt || "",
    source: "local",
    contentHtml: processed.toString(),
  };
}
