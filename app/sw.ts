import { defaultCache, PAGES_CACHE_NAME } from "@serwist/next/worker";
import type { PrecacheEntry, RuntimeCaching, SerwistGlobalConfig } from "serwist";
import { ExpirationPlugin, Serwist, StaleWhileRevalidate } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

// Localized pages are stale-while-revalidate so surahs stay readable offline.
// OfflinePrecacher writes into this same cache, so the limits are generous
// enough to hold all 114 surahs plus the other pages of every locale.
const localePages: RuntimeCaching = {
  matcher: ({ request, sameOrigin, url: { pathname } }) =>
    sameOrigin &&
    request.destination === "document" &&
    /^\/(en|ar|tr)(\/[^._]*)?$/.test(pathname),
  handler: new StaleWhileRevalidate({
    cacheName: PAGES_CACHE_NAME.html,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 400,
        maxAgeSeconds: 30 * 24 * 60 * 60,
        maxAgeFrom: "last-used",
      }),
    ],
  }),
};

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [localePages, ...defaultCache],
  fallbacks: {
    entries: [
      {
        url: "/offline.html",
        matcher: ({ request }) => request.destination === "document",
      },
    ],
  },
});

serwist.addEventListeners();
