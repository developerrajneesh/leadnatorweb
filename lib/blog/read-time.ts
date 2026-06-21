import type { OutputData } from "@editorjs/editorjs";

function blockText(data: Record<string, unknown>): string {
  if (typeof data.text === "string") return data.text.replace(/<[^>]+>/g, " ");
  if (typeof data.message === "string") return data.message.replace(/<[^>]+>/g, " ");
  if (typeof data.code === "string") return data.code;
  if (typeof data.caption === "string") return data.caption.replace(/<[^>]+>/g, " ");
  if (Array.isArray(data.items)) {
    return data.items
      .map((item) => {
        if (typeof item === "string") return item.replace(/<[^>]+>/g, " ");
        if (item && typeof item === "object" && "text" in item) {
          return String((item as { text: string }).text).replace(/<[^>]+>/g, " ");
        }
        return "";
      })
      .join(" ");
  }
  return "";
}

export function estimateReadMinutes(content: OutputData): number {
  const text = (content.blocks ?? [])
    .map((block) => blockText(block.data as Record<string, unknown>))
    .join(" ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}
