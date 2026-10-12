import fs from "node:fs";
import path from "node:path";

const feedUrl = "https://realtimedispatch.substack.com/feed";
const outputPath = path.join(process.cwd(), "data", "substack-posts.json");

function decodeXml(value) {
  return value
    .replace(/^<!\[CDATA\[|\]\]>$/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'");
}

function field(item, name) {
  const match = item.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, "i"));
  return match ? decodeXml(match[1].trim()) : "";
}

function plainText(value) {
  return decodeXml(value.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function inferredCategory(title) {
  return /opentelemetry|eventhouse|eventstream/i.test(title) ? "real-time" : "architecture-strategy";
}

function parseFeed(xml) {
  const today = new Date();
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)]
    .map((match) => {
      const item = match[1];
      const title = field(item, "title").trim();
      const url = field(item, "link").trim();
      const published = new Date(field(item, "pubDate"));
      const date = Number.isNaN(published.getTime()) ? "" : published.toISOString().slice(0, 10);
      const excerpt = plainText(field(item, "description"));
      const pathSlug = new URL(url).pathname.split("/").filter(Boolean).at(-1) || "post";
      return {
        slug: `${date}-${pathSlug}`,
        title,
        date,
        category: inferredCategory(title),
        url,
        excerpt,
        published,
      };
    })
    .filter((post) =>
      post.title &&
      post.date &&
      post.published <= today &&
      post.url.startsWith("https://realtimedispatch.substack.com/p/")
    )
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(({ published: _published, ...post }) => post);
}

try {
  const response = await fetch(feedUrl, { headers: { "user-agent": "christophermschmidt.com build sync" } });
  if (!response.ok) throw new Error(`RSS request returned ${response.status}`);
  const posts = parseFeed(await response.text());
  if (!posts.length) throw new Error("RSS feed contained no published posts");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(posts, null, 2)}\n`, "utf8");
  console.log(`Synced ${posts.length} published Substack posts.`);
} catch (error) {
  if (!fs.existsSync(outputPath)) throw error;
  console.warn(`Substack sync unavailable; using the committed snapshot. ${error.message}`);
}
