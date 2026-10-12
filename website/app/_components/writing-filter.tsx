"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type WritingItem = { slug: string; title: string; date: string; category: string; href: string; external: boolean; excerpt: string };
function formatCategory(value: string) {
  return value.split("-").map((part) => part ? part[0].toUpperCase() + part.slice(1) : "").join(" ");
}

export function WritingFilter({ items }: { items: WritingItem[] }) {
  const categories = ["All", ...Array.from(new Set(items.map((item) => item.category).filter(Boolean)))];
  const [filter, setFilter] = useState("All");
  const visible = useMemo(() => filter === "All" ? items : items.filter((item) => item.category === filter), [filter, items]);
  return <div>
    <div className="article-filter" role="group" aria-label="Filter articles by topic">
      {categories.map((category) => <button className="filter-btn" key={category} type="button" aria-pressed={filter === category} onClick={() => setFilter(category)}>{category === "All" ? category : formatCategory(category)}</button>)}
    </div>
    <div className="writing-list-page">{visible.map((item) => {
      const content = <><div className="article-meta">{item.category || "Essay"} / {item.date}</div><div className="article-title-row"><h3>{item.title}</h3><span aria-hidden="true">↗</span></div>{item.excerpt && <p className="writing-excerpt">{item.excerpt}</p>}</>;
      return item.external
        ? <a href={item.href} className="writing-item" target="_blank" rel="noopener noreferrer" key={item.slug}>{content}</a>
        : <Link href={item.href} className="writing-item" key={item.slug}>{content}</Link>;
    })}</div>
    <p className="small muted article-count" role="status">Showing {visible.length} {filter === "All" ? "published articles" : `${formatCategory(filter).toLowerCase()} article${visible.length === 1 ? "" : "s"}`}.</p>
  </div>;
}
