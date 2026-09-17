import createNextIntlPlugin from "next-intl/plugin";
import withSerwistInit from "@serwist/next";

const withNextIntl = createNextIntlPlugin();

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  // Cache pages as they are visited via next/link, matching the previous setup.
  cacheOnNavigation: true,
  // The service worker is only built for production; dev runs on Turbopack.
  disable: process.env.NODE_ENV !== "production",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
};

export default withSerwist(withNextIntl(nextConfig));
