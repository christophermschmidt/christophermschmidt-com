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
          <header className="border-b border-border-default">
            <nav className="max-w-content mx-auto px-6 h-14 flex items-center justify-between">
              <Link
                href="/"
                className="text-sm font-semibold tracking-tight text-text-primary hover:text-accent transition-colors"
                aria-label="Christopher Schmidt — home"
              >
                CS
              </Link>
              <div className="flex items-center gap-5 sm:gap-8 overflow-x-auto">
                <Link
                  href="/darf"
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors whitespace-nowrap"
                >
                  DARF
                </Link>
                <Link
                  href="/articles"
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors whitespace-nowrap"
                >
                  Writing
                </Link>
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
