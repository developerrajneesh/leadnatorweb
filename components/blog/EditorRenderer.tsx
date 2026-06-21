import { shouldUnoptimizeImage } from "@/lib/blog/media";
import { cleanEditorHtml } from "@/lib/blog/html";
import type { OutputBlockData, OutputData } from "@editorjs/editorjs";
import Image from "next/image";

function html(value: string) {
  return { dangerouslySetInnerHTML: { __html: cleanEditorHtml(value) } };
}

function renderBlock(block: OutputBlockData, i: number) {
  const { type, data } = block;

  switch (type) {
    case "header":
      if (data.level === 3) return <h3 key={i} {...html(data.text)} />;
      if (data.level === 4) return <h4 key={i} {...html(data.text)} />;
      return <h2 key={i} {...html(data.text)} />;

    case "paragraph":
      return <p key={i} {...html(data.text)} />;

    case "list": {
      const Tag = data.style === "ordered" ? "ol" : "ul";
      return (
        <Tag key={i} className={data.style === "ordered" ? "blog-list-ordered" : "blog-list-unordered"}>
          {(data.items as string[]).map((item, j) => (
            <li key={j} {...html(item)} />
          ))}
        </Tag>
      );
    }

    case "checklist":
      return (
        <ul key={i} className="blog-checklist">
          {(data.items as { text: string; checked: boolean }[]).map((item, j) => (
            <li key={j} className={item.checked ? "checked" : ""}>
              <span className="blog-check">{item.checked ? "✓" : ""}</span>
              <span {...html(item.text)} />
            </li>
          ))}
        </ul>
      );

    case "quote":
      return (
        <blockquote key={i} className="blog-quote">
          <p {...html(data.text)} />
          {data.caption && <cite {...html(data.caption)} />}
        </blockquote>
      );

    case "warning":
      return (
        <div key={i} className="blog-warning">
          {data.title && <strong {...html(data.title)} />}
          <p {...html(data.message)} />
        </div>
      );

    case "delimiter":
      return <hr key={i} className="blog-delimiter" />;

    case "code":
      return (
        <pre key={i} className="blog-code">
          <code>{data.code}</code>
        </pre>
      );

    case "image":
      return (
        <figure key={i} className="blog-figure">
          <Image
            src={data.file?.url || data.url}
            alt={data.caption || "Blog image"}
            width={1200}
            height={675}
            className="blog-figure-img"
            unoptimized={shouldUnoptimizeImage(String(data.file?.url || data.url))}
          />
          {data.caption && <figcaption {...html(data.caption)} />}
        </figure>
      );

    case "embed":
      return (
        <div key={i} className="blog-embed" dangerouslySetInnerHTML={{ __html: data.embed }} />
      );

    case "linkTool":
      return (
        <a key={i} href={data.link} className="blog-link-card" target="_blank" rel="noopener noreferrer">
          {data.meta?.image?.url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.meta.image.url} alt="" className="blog-link-card-img" />
          )}
          <div>
            <strong>{data.meta?.title || data.link}</strong>
            {data.meta?.description && <p>{data.meta.description}</p>}
          </div>
        </a>
      );

    default:
      return null;
  }
}

type Props = {
  data: OutputData;
  className?: string;
};

export default function EditorRenderer({ data, className = "blog-prose" }: Props) {
  if (!data?.blocks?.length) {
    return <p className="blog-empty">No content yet.</p>;
  }
  return <div className={className}>{data.blocks.map(renderBlock)}</div>;
}
