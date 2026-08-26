import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "Christopher Schmidt",
    template: "%s — Christopher Schmidt",
  },
  description:
    "Christopher Schmidt is VP, Solutions Engineering and AI - Enterprise AI at iLink Digital, and creator of the Data and AI Readiness Framework (DARF). Writing on ontologies, knowledge graphs, operational analytics, and real-time intelligence in Microsoft Fabric.",
  metadataBase: new URL("https://christophermschmidt.com"),
  openGraph: {
    type: "website",
    siteName: "Christopher Schmidt",
    title: "Christopher Schmidt",
    description:
      "VP, Solutions Engineering and AI - Enterprise AI at iLink Digital. Creator of the Data and AI Readiness Framework (DARF). Writes Real Time Dispatch.",
    url: "https://christophermschmidt.com",
  },
  twitter: {
    card: "summary",
    title: "Christopher Schmidt",
    description:
      "VP, Solutions Engineering and AI - Enterprise AI at iLink Digital. Creator of the Data and AI Readiness Framework (DARF).",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Christopher Schmidt",
  url: "https://christophermschmidt.com",
  jobTitle: "VP, Solutions Engineering and AI - Enterprise AI",
  worksFor: {
    "@type": "Organization",
    name: "iLink Digital",
  },
  knowsAbout: [
    "Microsoft Fabric",
    "Real-Time Intelligence",
    "Knowledge Graphs",
    "Ontologies",
    "Agentic AI",
    "Data and AI Readiness Framework",
  ],
  sameAs: [
    "https://www.linkedin.com/newsletters/the-real-time-dispatch-7368234962522755072/",
    "https://realtimedispatch.substack.com/",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-text-primary font-sans`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <div className="min-h-screen flex flex-col">
          <header className="sticky top-0 z-50 border-b border-border-default bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
            <nav className="max-w-content mx-auto px-6 h-16 flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-2.5 group"
                aria-label="Christopher Schmidt — home"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/Self-Portrait.png"
                  alt=""
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover border border-border-default"
                />
                <span className="text-sm font-semibold tracking-tight text-text-primary group-hover:text-accent transition-colors hidden sm:inline">
                  Christopher Schmidt
                </span>
              </Link>
              <div className="flex items-center gap-5 sm:gap-8">
                <div className="relative group/darf">
                  <Link
                    href="/darf"
                    className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors whitespace-nowrap"
                  >
                    DARF
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-3.5 h-3.5 text-text-muted transition-transform group-hover/darf:rotate-180"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                  <div className="absolute left-0 top-full pt-2 hidden group-hover/darf:block">
                    <div className="min-w-[190px] rounded-lg border border-border-default bg-background shadow-lg shadow-black/5 py-1.5">
                      <Link
                        href="/darf"
                        className="block px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-border-default/30 transition-colors"
                      >
                        Overview
                      </Link>
                      <Link
                        href="/darf/capabilities"
                        className="block px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-border-default/30 transition-colors"
                      >
                        Capability Library
                      </Link>
                    </div>
                  </div>
                </div>
                <a
                  href="https://realtimedispatch.substack.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors whitespace-nowrap"
                >
                  Writing
                </a>
                <Link
                  href="/speaking"
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors whitespace-nowrap"
                >
                  Speaking
                </Link>
                <Link
                  href="/about"
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors whitespace-nowrap"
                >
                  About
                </Link>
              </div>
            </nav>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t border-border-default mt-24">
            <div className="max-w-content mx-auto px-6 py-8 flex items-center justify-between">
              <p className="text-sm text-text-muted">
                © {new Date().getFullYear()} Christopher Schmidt
              </p>
              <a
                href="https://realtimedispatch.substack.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-muted hover:text-accent transition-colors"
              >
                The Real Time Dispatch ↗
              </a>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
