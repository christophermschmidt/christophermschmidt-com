"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const links = [
  ["Leadership work", "/work"],
  ["Approach", "/approach"],
  ["DARF", "/darf"],
  ["Writing & speaking", "/writing"],
  ["About", "/about"],
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && open) {
        setOpen(false);
        menuButton.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link href="/" className="brand" aria-label="Christopher Schmidt, home">
          <span className="brand-name">Christopher Schmidt</span>
          <span className="brand-sub">Enterprise technology leadership</span>
        </Link>
        <button ref={menuButton} className="menu-toggle" type="button" aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}>
          {open ? "Close" : "Menu"}
        </button>
        <nav id="primary-navigation" aria-label="Primary navigation" className={`main-nav${open ? " open" : ""}`}>
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="nav-link" aria-current={pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined}>{label}</Link>
          ))}
          <Link href="/contact" className="nav-link nav-contact" aria-current={pathname === "/contact" ? "page" : undefined}>Connect</Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-main">
          <Link href="/" className="footer-brand">Christopher Schmidt</Link>
          <nav className="footer-links" aria-label="Footer navigation">
            <Link href="/work">Leadership work</Link>
            <Link href="/darf">DARF</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Christopher Schmidt</span><span>Enterprise platforms · Engineering · Data &amp; AI</span></div>
      </div>
    </footer>
  );
}
