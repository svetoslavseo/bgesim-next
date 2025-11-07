/** @type {import('next').NextConfig} */
// Conditionally load bundle analyzer if available
let withBundleAnalyzer = (config) => config;
try {
  if (process.env.ANALYZE === 'true') {
    withBundleAnalyzer = require('@next/bundle-analyzer')({
      enabled: true,
    });
  }
} catch (e) {
  // Bundle analyzer not installed, skip it
  console.warn('Bundle analyzer not installed. Run: npm install @next/bundle-analyzer');
}

const nextConfig = {
  // Removed static export to enable API routes in production
  // output: 'export', // REMOVED - API routes need server mode
  
  // Exclude API routes from static generation
  generateBuildId: async () => {
    return process.env.BUILD_ID || 'production';
  },
  
  // Add trailing slashes to match WordPress URL structure
  trailingSlash: true,
  
  // Image configuration - Optimized based on Next.js best practices
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Enable automatic image optimization
    unoptimized: false,
  },
  
  // Optimize fonts
  optimizeFonts: true,
  
  // Compiler options
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'], // Keep errors and warnings
    } : false,
  },
  
  // Strict mode for better development
  reactStrictMode: true,
  
  // Performance optimizations
  poweredByHeader: false,
  generateEtags: true,
  
  // Compress responses
  compress: true,
  
  // Experimental features for performance (Next.js 14 optimizations)
  experimental: {
    // Optimize package imports - reduce bundle size for icon libraries and more
    optimizePackageImports: [
      'react',
      'react-dom',
      'react-icons', // Optimize react-icons to only import used icons
      'marked', // Optimize marked library imports
    ],
    // Enable modern bundling
    esmExternals: true,
    // Optimize server components
    serverComponentsExternalPackages: [],
  },
  
  // Webpack configuration
  webpack: (config, { isServer, dev }) => {
    // Allow importing JSON files from data directory
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
      '@/data': require('path').resolve(__dirname, 'data'),
    };
    
    // Production optimizations
    if (!dev && !isServer) {
      // Enable tree shaking
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
      
      // Optimize chunks with better splitting strategy
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          // Framework chunks (React, Next.js)
          framework: {
            chunks: 'all',
            name: 'framework',
            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
            priority: 40,
            enforce: true,
          },
          // Vendor chunks (other node_modules)
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 20,
            reuseExistingChunk: true,
          },
          // Common chunks (shared code)
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      };
    }
    
    return config;
  },
};

// Export with bundle analyzer if enabled
module.exports = withBundleAnalyzer(nextConfig);



