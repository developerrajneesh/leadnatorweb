"use client";

import Link from "next/link";
import { appPath } from "@/lib/app-url";

/** Primary CTA — always opens the live app signup page. */
export function SignupLink({ className, children, ...rest }) {
  return (
    <a href={appPath("/signup")} className={className} {...rest}>
      {children}
    </a>
  );
}

export function LoginLink({ className, children, ...rest }) {
  return (
    <a href={appPath("/login")} className={className} rel="nofollow" {...rest}>
      {children}
    </a>
  );
}

/** Internal marketing route (Next.js). */
export function MarketingLink({ href, className, children, ...rest }) {
  return (
    <Link href={href} className={className} {...rest}>
      {children}
    </Link>
  );
}
