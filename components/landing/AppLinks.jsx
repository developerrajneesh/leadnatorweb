"use client";

import Link from "next/link";
import { APP_LOGIN_URL, APP_SIGNUP_URL } from "@/lib/app-url";

/** Primary CTA — always opens the live app signup page. */
export function SignupLink({ className, children, ...rest }) {
  return (
    <a href={APP_SIGNUP_URL} className={className} rel="nofollow" {...rest}>
      {children}
    </a>
  );
}

export function LoginLink({ className, children, ...rest }) {
  return (
    <a href={APP_LOGIN_URL} className={className} rel="nofollow" {...rest}>
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
