import Link from "next/link";
import Image from "next/image";
import { FiArrowRight, FiCalendar, FiClock } from "react-icons/fi";
import { shouldUnoptimizeImage } from "@/lib/blog/media";
import type { BlogPostSummary } from "@/lib/blog/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function PostCard({ post }: { post: BlogPostSummary }) {
  const date = post.publishedAt || post.createdAt;
  return (
    <article className="blog-card">
      <Link href={`/blog/${post.slug}`} className="blog-card-link">
        {post.coverImage ? (
          <div className="blog-card-cover">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="blog-card-cover-img"
              sizes="(max-width: 768px) 100vw, 33vw"
              unoptimized={shouldUnoptimizeImage(post.coverImage)}
            />
          </div>
        ) : (
          <div className="blog-card-cover blog-card-cover-placeholder">
            <span>Leadnator Blog</span>
          </div>
        )}
        <div className="blog-card-body">
          {post.tags.length > 0 && (
            <div className="blog-card-tags">
              {post.tags.slice(0, 2).map((t) => (
                <span key={t} className="blog-tag">{t}</span>
              ))}
            </div>
          )}
          <h2>{post.title}</h2>
          <p>{post.excerpt || "Read the full story on Leadnator blog."}</p>
          <div className="blog-card-meta">
            <span><FiCalendar aria-hidden /> {formatDate(date)}</span>
            <span><FiClock aria-hidden /> {post.author.split("@")[0]}</span>
          </div>
          <span className="blog-card-cta">
            Read more <FiArrowRight aria-hidden />
          </span>
        </div>
      </Link>
    </article>
  );
}
