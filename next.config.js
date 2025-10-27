/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for full SSG
  output: 'export',
  
  // Exclude API routes from static generation
  generateBuildId: async () => {
    return process.env.BUILD_ID || 'production';
  },
  
  // Add trailing slashes to match WordPress URL structure
  trailingSlash: true,
  
  // Image configuration for static export
  images: {
    unoptimized: true, // Required for static export
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Optimize fonts
  optimizeFonts: true,
  
  // Compiler options
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Strict mode for better development
  reactStrictMode: true,
  
  // Performance optimizations
  poweredByHeader: false,
  generateEtags: true,
  
  // Compress responses
  compress: true,
  
  // Experimental features for performance
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['react', 'react-dom'],
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
      
      // Optimize chunks
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;



