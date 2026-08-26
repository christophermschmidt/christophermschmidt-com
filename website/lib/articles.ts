import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const articlesDirectory = path.join(process.cwd(), "..", "articles");

export interface ArticleMeta {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  status: string;
  url: string;
}

export interface Article extends ArticleMeta {
  contentHtml: string;
}

function parseFrontmatterDate(value: unknown): string {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString().substring(0, 10);
  return String(value).substring(0, 10);
}

export function getAllArticles(): ArticleMeta[] {
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
      } as ArticleMeta;
    })
    .filter((a) => a.status === "published")
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const fullPath = path.join(articlesDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

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
    url: data.url || "",
    contentHtml: processed.toString(),
  };
}
