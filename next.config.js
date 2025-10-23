/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for full SSG
  output: 'export',
  
  // Add trailing slashes to match WordPress URL structure
  trailingSlash: true,
  
  // Image configuration for static export
  images: {
    unoptimized: true, // Required for static export
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
  
  // Experimental features
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['react', 'react-dom'],
  },
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Allow importing JSON files from data directory
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
      '@/data': require('path').resolve(__dirname, 'data'),
    };
    
    return config;
  },
};

module.exports = nextConfig;



