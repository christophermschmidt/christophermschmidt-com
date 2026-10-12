import assert from "node:assert/strict";
import test from "node:test";
import {
  getAllArticles,
  getAllLocalArticles,
  getArticleBySlug,
  getArticleHref,
  isExternalArticleUrl,
} from "../lib/articles.ts";

test("published Substack posts lead the writing index and link to the original source", () => {
  const articles = getAllArticles();
  assert.equal(articles[0].date, "2026-10-08");
  assert.equal(articles[0].title, "Stop Rushing to Ask an Agent What Was True of the World Yesterday");
  assert.equal(getArticleHref(articles[0]), "https://realtimedispatch.substack.com/p/stop-rushing-to-ask-an-agent-what");
  assert.equal(isExternalArticleUrl(articles[0].url), true);
  assert.ok(articles.some((article) => article.date === "2026-09-03"));
  assert.ok(articles.some((article) => article.date === "2026-08-27"));
});

test("legacy article routes remain available for inbound links", () => {
  const slugs = new Set(getAllLocalArticles().map((article) => article.slug));
  assert.ok(slugs.has("2026-07-09-stop-dooming-the-bi-developer"));
  assert.ok(slugs.has("2026-07-02-explaining-isnt-fixing"));
  assert.ok(slugs.has("2025-09-02-seamlessly-ingesting-xml-data-eventhouse"));
});

test("a mapped legacy route resolves to a concise original-source landing", async () => {
  const article = await getArticleBySlug("2026-07-02-explaining-isnt-fixing");
  assert.ok(article);
  assert.equal(article.url, "https://realtimedispatch.substack.com/p/why-explaining-the-problem-isnt-the");
  assert.equal(isExternalArticleUrl(article.url), true);
  assert.equal(article.excerpt, "Picture a dispatcher at 9:12 on a Tuesday morning.");
});
