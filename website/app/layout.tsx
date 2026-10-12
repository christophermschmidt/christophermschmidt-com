import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteFooter, SiteHeader } from "./_components/site-shell";
import "./globals.css";

const geistSans = localFont({ src: "./fonts/GeistVF.woff", variable: "--font-geist-sans", weight: "100 900" });
const geistMono = localFont({ src: "./fonts/GeistMonoVF.woff", variable: "--font-geist-mono", weight: "100 900" });

export const metadata: Metadata = {
  title: { default: "Christopher Schmidt | Enterprise technology leadership", template: "%s | Christopher Schmidt" },
  description: "Christopher Schmidt leads engineering organizations, modernizes production platforms, and scales enterprise data and AI adoption.",
  metadataBase: new URL("https://christophermschmidt.com"),
  openGraph: { type: "website", siteName: "Christopher Schmidt", title: "Christopher Schmidt | Enterprise technology leadership", description: "Building the enterprise platforms that turn data and AI into operational capability.", url: "https://christophermschmidt.com" },
  twitter: { card: "summary", title: "Christopher Schmidt | Enterprise technology leadership", description: "Building the enterprise platforms that turn data and AI into operational capability." },
};

const personJsonLd = {
  "@context": "https://schema.org", "@type": "Person", name: "Christopher Schmidt", url: "https://christophermschmidt.com",
  jobTitle: "VP, Solutions Engineering and AI - Enterprise AI", worksFor: { "@type": "Organization", name: "iLink Digital" },
  knowsAbout: ["Enterprise technology leadership", "Engineering leadership", "Data and AI readiness", "Real-Time Intelligence"],
  sameAs: ["https://www.linkedin.com/in/christophermschmidt", "https://realtimedispatch.substack.com/"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} /><a className="skip-link" href="#main-content">Skip to main content</a><SiteHeader /><main id="main-content" tabIndex={-1}>{children}</main><SiteFooter /></body></html>;
}
