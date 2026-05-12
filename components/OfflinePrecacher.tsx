"use client";

import { useEffect } from "react";

const PRECACHE_INTERVAL = 7 * 24 * 60 * 60 * 1000; // 1 week

export default function OfflinePrecacher({ locale }: { locale: string }) {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const key = `offline-precached-${locale}`;
    const last = localStorage.getItem(key);
    if (last && Date.now() - Number(last) < PRECACHE_INTERVAL) return;

    // Delay precaching to avoid competing with initial page load
    const timer = setTimeout(async () => {
      try {
        await navigator.serviceWorker.ready;
        const cache = await caches.open("pages");

        for (let i = 1; i <= 114; i++) {
          const url = `/${locale}/${i}`;
          const existing = await cache.match(url);
          if (existing) continue;
          try {
            const res = await fetch(url);
            if (res.ok) await cache.put(url, res);
          } catch {
            // Network error — stop precaching, retry next session
            return;
          }
          // Small delay between requests to stay gentle on bandwidth
          await new Promise((r) => setTimeout(r, 150));
        }

        // Also cache key pages
        for (const path of [`/${locale}`, `/${locale}/bookmarks`, `/${locale}/athkar`]) {
          try {
            const existing = await cache.match(path);
            if (!existing) {
              const res = await fetch(path);
              if (res.ok) await cache.put(path, res);
            }
          } catch {}
        }

        localStorage.setItem(key, String(Date.now()));
      } catch {}
    }, 10000);

    return () => clearTimeout(timer);
  }, [locale]);

  return null;
}
