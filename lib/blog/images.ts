import type { OutputBlockData, OutputData } from "@editorjs/editorjs";

function imageUrlFromBlock(block: OutputBlockData): string | undefined {
  if (block.type !== "image") return undefined;
  const data = block.data as { file?: { url?: string }; url?: string };
  return data.file?.url || data.url;
}

export function getFirstImageFromContent(content?: OutputData): string | undefined {
  if (!content?.blocks?.length) return undefined;
  for (const block of content.blocks) {
    const url = imageUrlFromBlock(block);
    if (url) return url;
  }
  return undefined;
}

export function resolvePostCoverImage(post: {
  coverImage?: string;
  content?: OutputData;
}): string | undefined {
  return post.coverImage || getFirstImageFromContent(post.content);
}
