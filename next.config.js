const createNextIntlPlugin = require("next-intl/plugin");
const withNextIntl = createNextIntlPlugin();

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  cacheOnFrontEndNav: true,
  fallbacks: {
    document: "/offline.html",
  },
  extendDefaultRuntimeCaching: true,
  workboxOptions: {
    runtimeCaching: [
      {
        urlPattern: /\/(en|ar|tr)(\/[^._]*)?$/,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "pages",
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 30 * 24 * 60 * 60,
          },
        },
      },
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
};

module.exports = withPWA(withNextIntl(nextConfig));
