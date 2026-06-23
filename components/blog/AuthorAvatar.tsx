import Image from "next/image";
import { shouldUnoptimizeImage } from "@/lib/blog/media";
import type { BlogAuthorProfile } from "@/lib/blog/author-profile";

type Props = {
  author: Pick<BlogAuthorProfile, "displayName" | "avatarUrl" | "initials">;
  size?: "md" | "lg";
  className?: string;
};

const SIZES = {
  md: { box: 40, img: 40, className: "blog-vlog-avatar" },
  lg: { box: 56, img: 56, className: "blog-vlog-avatar blog-vlog-avatar-lg" },
};

export default function AuthorAvatar({ author, size = "md", className }: Props) {
  const cfg = SIZES[size];
  const cls = className ?? cfg.className;

  if (author.avatarUrl) {
    return (
      <span className={`${cls} blog-vlog-avatar-photo`}>
        <Image
          src={author.avatarUrl}
          alt={author.displayName}
          width={cfg.img}
          height={cfg.img}
          className="blog-vlog-avatar-img"
          unoptimized={shouldUnoptimizeImage(author.avatarUrl)}
        />
      </span>
    );
  }

  return (
    <span className={cls} aria-hidden>
      {author.initials}
    </span>
  );
}
