const createNextIntlPlugin = require("next-intl/plugin");
const withNextIntl = createNextIntlPlugin();

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  fallbacks: {
    document: "/offline.html",
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
};

module.exports = withPWA(withNextIntl(nextConfig));
