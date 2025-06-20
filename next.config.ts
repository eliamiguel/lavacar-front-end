import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost'],
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
      {
        protocol: "http",
        hostname: "localhost",
        port: "8002",
        pathname: "/upload/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "", 
        pathname: "/**",
      },
    ],
  },
  productionBrowserSourceMaps: false,
  webpack(config) {
    
    return config;
  },
};

export default nextConfig;
