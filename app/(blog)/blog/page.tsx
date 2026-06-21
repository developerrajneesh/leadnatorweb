import Link from "next/link";
import { PageStructuredData } from "@/components/seo/StructuredData";
import PostCard from "@/components/blog/PostCard";
import { listPosts } from "@/lib/blog/store";
import { buildPageMetadata } from "@/lib/marketing-seo";

export const metadata = buildPageMetadata("/blog");
export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await listPosts("published");

  return (
    <>
      <PageStructuredData path="/blog" />

      <section className="ln-sub-hero">
        <div className="ln-container">
          <span className="ln-eyebrow">Leadnator Blog</span>
          <h1>Articles, guides &amp; product updates</h1>
          <p>
            WhatsApp marketing, CRM workflows and growth stories — written by the Leadnator team.
          </p>
        </div>
      </section>

      <section className="ln-section blog-vlog-index" id="posts">
        <div className="blog-vlog-wrap">
          <div className="blog-vlog-index-head">
            <h2>All articles</h2>
            <p>{posts.length} published</p>
          </div>

          {posts.length === 0 ? (
            <div className="blog-vlog-empty">
              <h3>No articles yet</h3>
              <p>New posts will appear here once published.</p>
              <Link href="/" className="ln-btn ln-btn-outline">Back to home</Link>
            </div>
          ) : (
            <div className="blog-vlog-grid-cards">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
