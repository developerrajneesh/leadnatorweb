import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FiArrowLeft, FiArrowRight, FiCalendar, FiCheck, FiClock, FiPhone } from "react-icons/fi";
import EditorRenderer from "@/components/blog/EditorRenderer";
import { PageStructuredData } from "@/components/seo/StructuredData";
import { getPostBySlug, getAllSlugs, getRelatedPosts } from "@/lib/blog/store";
import { resolvePostCoverImage } from "@/lib/blog/images";
import { shouldUnoptimizeImage } from "@/lib/blog/media";
import { estimateReadMinutes } from "@/lib/blog/read-time";
import { formatTagLabel } from "@/lib/blog/html";
import { APP_SIGNUP_URL } from "@/lib/app-url";
import { absoluteUrl, SITE_NAME } from "@/lib/marketing-seo";
import type { Metadata } from "next";
import { FaWhatsapp } from "react-icons/fa";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found" };

  const coverImage = resolvePostCoverImage(post);
  const url = absoluteUrl(`/blog/${slug}`);
  const title = `${post.title} · ${SITE_NAME} Blog`;

  return {
    title: post.title,
    description: post.excerpt || post.title,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: post.excerpt,
      url,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: coverImage ? [{ url: coverImage.startsWith("http") ? coverImage : absoluteUrl(coverImage) }] : undefined,
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function authorProfile(email: string) {
  const local = email.split("@")[0] || "Leadnator";
  if (/^admin$/i.test(local) || email.endsWith("@leadnator.com")) {
    return { name: "Leadnator Team", initials: "LN", role: "Content & Growth" };
  }
  const name = local
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  const parts = name.split(" ").filter(Boolean);
  const initials =
    parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.slice(0, 2).toUpperCase();
  return { name, initials, role: "Leadnator Team" };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const coverImage = resolvePostCoverImage(post);
  const date = post.publishedAt || post.createdAt;
  const readMinutes = estimateReadMinutes(post.content);
  const related = await getRelatedPosts(post.id, post.tags, 3);
  const author = authorProfile(post.author);
  const primaryTag = post.tags[0];
  const showCover = Boolean(coverImage && post.coverImage);

  return (
    <>
      <PageStructuredData path="/blog" />

      <article className="blog-vlog-page">
        <div className="blog-vlog-wrap">
          <Link href="/blog" className="blog-vlog-back">
            <FiArrowLeft aria-hidden /> Back to Blogs
          </Link>

          {showCover && (
            <figure className="blog-vlog-hero">
              <Image
                src={coverImage!}
                alt={post.title}
                width={1920}
                height={1080}
                className="blog-vlog-hero-img"
                sizes="(max-width: 1280px) 100vw, 1280px"
                priority
                unoptimized={shouldUnoptimizeImage(coverImage!)}
              />
            </figure>
          )}

          <div className="blog-vlog-grid">
            <div className="blog-vlog-main">
              {primaryTag && (
                <span className="blog-vlog-category">{formatTagLabel(primaryTag)}</span>
              )}

              <header className="blog-vlog-header">
                <h1>{post.title}</h1>

                <div className="blog-vlog-byline">
                  <div className="blog-vlog-author">
                    <span className="blog-vlog-avatar" aria-hidden>{author.initials}</span>
                    <div>
                      <strong>{author.name}</strong>
                      <span>{author.role}</span>
                    </div>
                  </div>
                  <div className="blog-vlog-meta">
                    <span><FiCalendar aria-hidden /> {formatDate(date)}</span>
                    <span><FiClock aria-hidden /> {readMinutes} min read</span>
                  </div>
                </div>
              </header>

              {post.excerpt && <p className="blog-vlog-lead">{post.excerpt}</p>}

              <EditorRenderer data={post.content} className="blog-prose blog-vlog-prose" />

              <aside className="blog-vlog-written-by">
                <span className="blog-vlog-avatar blog-vlog-avatar-lg" aria-hidden>
                  {author.initials}
                </span>
                <div>
                  <h2>Written by {author.name}</h2>
                  <p className="blog-vlog-written-role">{author.role}</p>
                  <p className="blog-vlog-written-bio">
                    {author.name} writes about WhatsApp marketing, CRM workflows, and growth
                    strategies for businesses using {SITE_NAME}.
                  </p>
                </div>
              </aside>
            </div>

            <aside className="blog-vlog-sidebar">
              {related.length > 0 && (
                <section className="blog-vlog-side-card" aria-labelledby="related-articles">
                  <h2 id="related-articles">Related Articles</h2>
                  <ul className="blog-vlog-related-list">
                    {related.map((item) => {
                      const itemDate = item.publishedAt || item.createdAt;
                      const itemCover = resolvePostCoverImage(item);
                      return (
                        <li key={item.id}>
                          <Link href={`/blog/${item.slug}`} className="blog-vlog-related-item">
                            {itemCover ? (
                              <div className="blog-vlog-related-thumb">
                                <Image
                                  src={itemCover}
                                  alt=""
                                  fill
                                  sizes="80px"
                                  className="blog-vlog-related-thumb-img"
                                  unoptimized={shouldUnoptimizeImage(itemCover)}
                                />
                              </div>
                            ) : (
                              <div className="blog-vlog-related-thumb blog-vlog-related-thumb-empty">
                                LN
                              </div>
                            )}
                            <div>
                              <h3>{item.title}</h3>
                              <time dateTime={itemDate}>{formatDate(itemDate)}</time>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                  <Link href="/blog" className="blog-vlog-see-more">
                    See more <FiArrowRight aria-hidden />
                  </Link>
                </section>
              )}

              <section className="blog-vlog-side-card blog-vlog-side-cta">
                <h2>Ready to Transform Your Business?</h2>
                <p>
                  Try {SITE_NAME} and see how WhatsApp CRM, Meta Ads and AI automation can boost
                  your lead conversion.
                </p>
                <a className="blog-vlog-side-cta-btn" href={APP_SIGNUP_URL} rel="nofollow">
                  Get Started Today
                </a>
              </section>
            </aside>
          </div>
        </div>
      </article>

      <section className="ln-cta blog-vlog-bottom-cta">
        <div className="ln-container">
          <div className="ln-cta-card">
            <div className="ln-cta-copy">
              <h2>Ready to transform your lead generation?</h2>
              <p>
                Join businesses using {SITE_NAME} to capture WhatsApp leads, automate follow-ups,
                and never miss a customer message again.
              </p>
              <ul className="ln-cta-list">
                <li><FiCheck /> 14-day free trial — no credit card</li>
                <li><FiCheck /> Official WhatsApp Business API</li>
                <li><FiCheck /> Setup in under 12 minutes</li>
              </ul>
            </div>
            <div className="ln-cta-actions">
              <a className="ln-btn ln-btn-primary ln-btn-lg ln-btn-block" href={APP_SIGNUP_URL} rel="nofollow">
                Start FREE Trial <FiArrowRight />
              </a>
              <a className="ln-btn ln-btn-outline-dark ln-btn-lg ln-btn-block" href="https://wa.me/917888341096">
                <FaWhatsapp /> Chat on WhatsApp
              </a>
              <div className="ln-cta-call">
                <FiPhone /> Sales: <a href="tel:+917888341096">+917888341096</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
