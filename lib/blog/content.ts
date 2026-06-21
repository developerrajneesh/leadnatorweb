import type { OutputBlockData, OutputData } from "@editorjs/editorjs";
import { cleanEditorHtml } from "./html";
import { enhanceSignupCtaHtml } from "./signup-cta";

export type BlogPostContent = string | OutputData;

export function isEditorJsContent(content: unknown): content is OutputData {
  return (
    typeof content === "object" &&
    content !== null &&
    "blocks" in content &&
    Array.isArray((content as OutputData).blocks)
  );
}

function blockToHtml(block: OutputBlockData): string {
  const { type, data } = block;

  switch (type) {
    case "header": {
      const level = Math.min(4, Math.max(2, Number(data.level) || 2));
      return `<h${level}>${data.text ?? ""}</h${level}>`;
    }
    case "paragraph":
      return `<p>${data.text ?? ""}</p>`;
    case "list": {
      const tag = data.style === "ordered" ? "ol" : "ul";
      const items = (data.items as string[]).map((item) => `<li>${item}</li>`).join("");
      return `<${tag}>${items}</${tag}>`;
    }
    case "checklist": {
      const items = (data.items as { text: string; checked: boolean }[])
        .map((item) => `<li>${item.checked ? "✓ " : ""}${item.text}</li>`)
        .join("");
      return `<ul>${items}</ul>`;
    }
    case "quote":
      return `<blockquote><p>${data.text ?? ""}</p>${data.caption ? `<cite>${data.caption}</cite>` : ""}</blockquote>`;
    case "warning":
      return `<div class="blog-warning">${data.title ? `<strong>${data.title}</strong>` : ""}<p>${data.message ?? ""}</p></div>`;
    case "delimiter":
      return "<hr />";
    case "code":
      return `<pre><code>${String(data.code ?? "").replace(/</g, "&lt;")}</code></pre>`;
    case "image": {
      const url = (data.file as { url?: string })?.url || data.url;
      if (!url) return "";
      return `<figure><img src="${url}" alt="${data.caption || ""}" />${data.caption ? `<figcaption>${data.caption}</figcaption>` : ""}</figure>`;
    }
    case "embed":
      return `<div class="blog-embed">${data.embed ?? ""}</div>`;
    default:
      return "";
  }
}

export function editorJsToHtml(content: OutputData): string {
  return (content.blocks ?? []).map(blockToHtml).join("");
}

export function contentHtmlForEditor(content?: BlogPostContent): string {
  if (!content) return "";
  if (typeof content === "string") return content;
  return editorJsToHtml(content);
}

export function hasPostContent(content?: BlogPostContent): boolean {
  if (!content) return false;
  if (typeof content === "string") {
    return content.replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").trim().length > 0;
  }
  return (content.blocks?.length ?? 0) > 0;
}

export function stripHtmlText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function sanitizeRenderedHtml(html: string): string {
  return enhanceSignupCtaHtml(cleanEditorHtml(html));
}

export { parseInlineSignupCta } from "./signup-cta";
