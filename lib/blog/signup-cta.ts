import { APP_SIGNUP_URL } from "@/lib/app-url";

export type SignupCta = { message: string; href: string };

const SIGNUP_IN_TEXT_RE = /app\.leadnator\.com\/signup|leadnator\.com\/signup/i;

export function isSignupHref(href: string): boolean {
  const h = href.trim();
  if (!h) return false;
  return /\/signup(?:[/?#]|$)/i.test(h) || SIGNUP_IN_TEXT_RE.test(h);
}

export function isSignupLinkText(text: string): boolean {
  const t = text.replace(/<[^>]+>/g, "").trim();
  return SIGNUP_IN_TEXT_RE.test(t) || /^→?\s*app\.leadnator/i.test(t);
}

export function isSignupAnchor(href: string, linkText: string): boolean {
  return isSignupHref(href) || isSignupLinkText(linkText);
}

export function cleanupCtaMessage(raw: string): string {
  return raw
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s*→\s*/g, " ")
    .replace(/\s*(Start free at|Sign up at|Try\s+Leadnator\s*(?:for free)?)\s*\.?\s*$/i, "")
    .replace(/\s*Try\s+\.?\s*$/i, "")
    .replace(/\s*at\s*\.?\s*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseInlineSignupCta(fragment: string): SignupCta | null {
  const anchor = fragment.match(/<a\b([^>]*?)href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/i);
  if (!anchor) return null;

  const href = anchor[2] || APP_SIGNUP_URL;
  const linkText = anchor[3] || "";
  if (!isSignupAnchor(href, linkText)) return null;

  const withoutLink = fragment.replace(/<a\b[\s\S]*?<\/a>/gi, " ");
  const message = cleanupCtaMessage(withoutLink) || "Ready to grow with Leadnator?";
  return { message, href: href || APP_SIGNUP_URL };
}

export function signupButtonHtml(href: string): string {
  const url = href || APP_SIGNUP_URL;
  return `<a class="blog-inline-cta-btn" href="${url}" rel="nofollow noopener noreferrer" target="_blank">Get started free <span aria-hidden="true">→</span></a>`;
}

export function signupCtaBlockHtml(message: string, href: string): string {
  return `<aside class="blog-inline-cta"><p>${message}</p>${signupButtonHtml(href)}</aside>`;
}

export function containsSignupLink(html: string): boolean {
  return SIGNUP_IN_TEXT_RE.test(html) || /\/signup(?:[/?#]|$)/i.test(html);
}

/** Rewrite signup links in article HTML into CTA button blocks. */
export function enhanceSignupCtaHtml(html: string): string {
  if (!containsSignupLink(html)) return html;

  let out = html;

  // Text paragraph, then link-only paragraph (common in SunEditor)
  out = out.replace(
    /<p\b[^>]*>([\s\S]*?)<\/p>\s*<p\b[^>]*>\s*(?:→\s*)?<a\b([^>]*?)href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>\s*\.?\s*<\/p>/gi,
    (full, prevText, _attrs, href, linkText) => {
      if (!isSignupAnchor(href, linkText)) return full;
      const message = cleanupCtaMessage(String(prevText));
      return signupCtaBlockHtml(message || "Ready to grow with Leadnator?", href);
    },
  );

  // Single block with text + signup link
  out = out.replace(
    /<(p|div)\b[^>]*>([\s\S]*?)<a\b([^>]*?)href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>([\s\S]*?)<\/\1>/gi,
    (full, _tag, before, _attrs, href, linkText, after) => {
      if (!isSignupAnchor(href, linkText)) return full;
      if (full.includes("blog-inline-cta")) return full;
      const message = cleanupCtaMessage(`${before}${after}`);
      return signupCtaBlockHtml(message || "Ready to grow with Leadnator?", href);
    },
  );

  // Standalone signup link still left
  out = out.replace(
    /<p\b[^>]*>\s*(?:→\s*)?<a\b([^>]*?)href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>\s*\.?\s*<\/p>/gi,
    (full, _attrs, href, linkText) => {
      if (!isSignupAnchor(href, linkText)) return full;
      return signupCtaBlockHtml("Ready to grow with Leadnator?", href);
    },
  );

  return out.replace(/<p>\s*<\/p>/gi, "");
}
