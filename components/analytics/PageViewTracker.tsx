"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { resolveClientUtm } from "@/lib/analytics/utm";

const VISITOR_KEY = "ln_visitor_id";

function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const viewIdRef = useRef<string | null>(null);
  const enteredAtRef = useRef(0);
  const flushingRef = useRef(false);

  const sendDuration = useCallback(() => {
    const viewId = viewIdRef.current;
    if (!viewId || flushingRef.current) return;

    flushingRef.current = true;
    viewIdRef.current = null;

    const sec = Math.min(
      1800,
      Math.max(1, Math.round((Date.now() - enteredAtRef.current) / 1000)),
    );

    fetch("/api/analytics/collect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "duration", viewId, durationSec: sec }),
      keepalive: true,
    })
      .catch(() => {})
      .finally(() => {
        flushingRef.current = false;
      });
  }, []);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/studio")) return;

    let cancelled = false;

    const startView = async () => {
      sendDuration();

      const params = new URLSearchParams(searchParams?.toString() || "");
      const utm = resolveClientUtm(params);

      try {
        const res = await fetch("/api/analytics/collect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "view",
            path: pathname,
            referrer: document.referrer || "",
            visitorId: getVisitorId(),
            utmSource: utm.utmSource,
            utmMedium: utm.utmMedium,
            utmCampaign: utm.utmCampaign,
            utmTerm: utm.utmTerm,
            utmContent: utm.utmContent,
          }),
          keepalive: true,
        });
        if (cancelled) return;
        const data = await res.json();
        if (data.viewId) {
          viewIdRef.current = data.viewId;
          enteredAtRef.current = Date.now();
        }
      } catch {
        /* ignore */
      }
    };

    startView();

    return () => {
      cancelled = true;
      sendDuration();
    };
  }, [pathname, searchParams, sendDuration]);

  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") sendDuration();
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", sendDuration);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", sendDuration);
    };
  }, [sendDuration]);

  return null;
}
