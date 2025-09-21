import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  reactStrictMode: true,
  output: "export", // خروجی استاتیک (ساخت فولدر out)
};

export default nextConfig;