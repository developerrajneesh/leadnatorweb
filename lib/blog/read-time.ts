import type { OutputBlockData } from "@editorjs/editorjs";
import type { BlogPostContent } from "./content";
import { isEditorJsContent, stripHtmlText } from "./content";

function blockText(data: Record<string, unknown>): string {
  if (typeof data.text === "string") return stripHtmlText(data.text);
  if (typeof data.message === "string") return stripHtmlText(data.message);
  if (typeof data.code === "string") return data.code;
  if (typeof data.caption === "string") return stripHtmlText(data.caption);
  if (Array.isArray(data.items)) {
    return data.items
      .map((item) => {
        if (typeof item === "string") return stripHtmlText(item);
        if (item && typeof item === "object" && "text" in item) {
          return stripHtmlText(String((item as { text: string }).text));
        }
        return "";
      })
      .join(" ");
  }
  return "";
}

function legacyReadText(content: BlogPostContent): string {
  if (!isEditorJsContent(content)) return "";
  return (content.blocks ?? [])
    .map((block) => blockText(block.data as Record<string, unknown>))
    .join(" ");
}

export function estimateReadMinutes(content: BlogPostContent): number {
  const text =
    typeof content === "string" ? stripHtmlText(content) : legacyReadText(content);
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}
