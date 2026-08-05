import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Note: the vehicle slug redirects live in src/middleware.ts, not here.
  // The old slugs contain `+`, `(`, `)` and `:`, which path-to-regexp treats as
  // quantifiers and capture groups — `redirects()` cannot express them.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
