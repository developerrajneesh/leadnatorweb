import Link from "next/link";
import { buildPageMetadata } from "@/lib/marketing-seo";

export const metadata = {
  ...buildPageMetadata("/"),
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "system-ui, sans-serif",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>404 — Page not found</h1>
      <p style={{ color: "#64748b", marginBottom: 24, maxWidth: 420 }}>
        This page does not exist. Explore features, pricing, or contact our team.
      </p>
      <nav style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
        <Link href="/">Home</Link>
        <Link href="/features">Features</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/faq">FAQ</Link>
        <Link href="/contact">Contact</Link>
      </nav>
    </main>
  );
}
