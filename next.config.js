/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["reroom.s3.amazonaws.com", "reroom.ai"],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 86400, // 24 hours
    dangerouslyAllowSVG: false,
  },
  experimental: {
    serverComponentsExternalPackages: ["jose"],
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "iftikhar.vercel.app",
        "interior-designer-ai.vercel.app",
      ],
    },
  },
  // Enable compression for better performance
  compress: true,
  // Optimize build output
  swcMinify: true,
  // Power optimizations
  poweredByHeader: false,
  // Generate ETags for better caching
  generateEtags: true,
  // Optimize bundle analyzer in production
  productionBrowserSourceMaps: false,
  // Add security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
    ];
  },
  // Add redirects for SEO
  async redirects() {
    // Previously: permanently redirected /home -> /dashboard.
    // This blocked access to the image generation page after login.
    // Return an empty array (no redirects) so /home remains accessible.
    return [];
  },
};

module.exports = nextConfig;
