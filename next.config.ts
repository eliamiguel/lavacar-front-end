import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["lavacar.gestaobc.net.br"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "example.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lavacar.gestaobc.net.br",
        pathname: "/api/upload/**",
      },
      {
        protocol: "https",
        hostname: "cdn.example.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/upload/**",
      },
      {
        protocol: "https",
        hostname: "lavacar.gestaobc.net.br",
        pathname: "/upload/**",
      },
      {
        protocol: "http",
        hostname: "lavacar.gestaobc.net.br",
        pathname: "/api/upload/**",
      },
      {
        protocol: "http",
        hostname: "lavacar.gestaobc.net.br",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lavacar.gestaobc.net.br",
        pathname: "/**",
      }
    ],
  },
  productionBrowserSourceMaps: false,
  webpack(config) {
    return config;
  },
};

export default nextConfig;

