type Props = {
  message: string;
  href: string;
};

export default function BlogInlineCta({ message, href }: Props) {
  return (
    <aside className="blog-inline-cta">
      <p>{message}</p>
      <a
        className="blog-inline-cta-btn"
        href={href}
        rel="nofollow noopener noreferrer"
        target="_blank"
      >
        Get started free <span aria-hidden="true">→</span>
      </a>
    </aside>
  );
}
