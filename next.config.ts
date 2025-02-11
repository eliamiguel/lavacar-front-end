import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', 
        port: '',
        pathname: '/**', 
      },
      {
        protocol: 'https',
        hostname: 'example.com', 
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.example.com', 
        port: '',
        pathname: '/**',
      },
    ],
  },
  productionBrowserSourceMaps: false,
  webpack(config) {
    
    return config;
  },
};

export default nextConfig;
