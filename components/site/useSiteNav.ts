"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { appPath, isAuthAppPath } from "@/lib/app-url";

export type SiteNav = (path: string) => void;

export function useSiteNav(): SiteNav {
  const router = useRouter();

  return useCallback(
    (path: string) => {
      if (isAuthAppPath(path)) {
        window.location.href = appPath(path);
        return;
      }

      const [pathname, hash] = path.split("#");
      const target = hash ? `${pathname}#${hash}` : pathname;

      router.push(target);
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      if (hash) {
        requestAnimationFrame(() => {
          const el = document.getElementById(hash);
          el?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    },
    [router],
  );
}
