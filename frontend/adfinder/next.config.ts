// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  
  allowedDevOrigins: ['192.168.163.47', 'localhost'],

  // output: 'export',
  trailingSlash: true,

  reactStrictMode: true,

  // برای اجازه fallback روی صفحات داینامیک
  images: {
    unoptimized: true,
  },
  
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ];
  },
  
  async redirects() {
    return [];
  }
};

module.exports = nextConfig;
