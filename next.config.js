/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.reservoir.tools",
        port: "",
        pathname: "/redirect/**/**/image/v1",
      },
    ],
    domains: ["api.reservoir.tools"],
  },
};

module.exports = nextConfig;
