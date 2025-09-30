import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  experimental: {
    // Enable optimizations that are stable in Next.js 15
    optimizeCss: true,
    // Note: ppr and reactCompiler require canary versions
    // serverComponentsExternalPackages: ["graphql-request"], // Removed - not needed in stable version
  },

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 31536000, // 1 year
  },

  // Compression and minification
  compress: true,
  // swcMinify: true, // Removed - enabled by default in Next.js 15

  // Compiler optimizations
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  // Bundle analyzer and webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Bundle analyzer (only in production builds)
    if (process.env.ANALYZE === "true" && !dev && !isServer) {
      try {
        const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: false,
            reportFilename: "bundle-report.html",
          })
        );
      } catch (error) {
        console.warn(
          "webpack-bundle-analyzer not installed, skipping bundle analysis"
        );
      }
    }

    // Optimize chunks
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk
            vendor: {
              chunks: "all",
              name: "vendor",
              test: /[\\/]node_modules[\\/]/,
              priority: 20,
            },
            // Common components chunk
            common: {
              name: "common",
              minChunks: 2,
              chunks: "all",
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
            // Dashboard components chunk
            dashboard: {
              name: "dashboard",
              test: /[\\/]components[\\/]dashboard[\\/]/,
              chunks: "all",
              priority: 15,
            },
          },
        },
      };
    }

    return config;
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Security headers
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Performance headers
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
      {
        // Cache static assets
        source: "/(_next/static|favicon.ico|robots.txt|manifest.json)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Temporarily ignore TypeScript and ESLint errors during development
  // Remove these in production
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === "development",
  },
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === "development",
  },

  // Optimize output
  output: "standalone",
  poweredByHeader: false,
};

export default nextConfig;
