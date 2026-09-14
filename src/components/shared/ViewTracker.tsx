"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Records a page view once per client-side navigation, via a small fire-and-forget beacon to
 * /api/track-view instead of a server-side DB write during render. Keeping this off the render
 * path is what lets the public pages be statically cached — a server-side write here would need
 * cookies(), and any use of cookies()/headers() forces the whole route into dynamic, uncached
 * rendering on every request, not just this one.
 */
export function ViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/track-view", { method: "POST", keepalive: true }).catch(() => {});
  }, [pathname]);

  return null;
}
