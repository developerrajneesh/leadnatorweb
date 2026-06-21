import type { OutputBlockData } from "@editorjs/editorjs";
import type { BlogPostContent } from "./content";
import { isEditorJsContent } from "./content";

function imageUrlFromBlock(block: OutputBlockData): string | undefined {
  if (block.type !== "image") return undefined;
  const data = block.data as { file?: { url?: string }; url?: string };
  return data.file?.url || data.url;
}

function firstImageFromHtml(html: string): string | undefined {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1];
}

export function getFirstImageFromContent(content?: BlogPostContent): string | undefined {
  if (!content) return undefined;
  if (typeof content === "string") return firstImageFromHtml(content);
  if (!isEditorJsContent(content)) return undefined;
  for (const block of content.blocks) {
    const url = imageUrlFromBlock(block);
    if (url) return url;
  }
  return undefined;
}

export function resolvePostCoverImage(post: {
  coverImage?: string;
  content?: BlogPostContent;
}): string | undefined {
  return post.coverImage || getFirstImageFromContent(post.content);
}
