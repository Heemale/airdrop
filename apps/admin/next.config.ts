import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3002',
        pathname: '/images/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'suiworld.cyou',
        port: '443',
        pathname: '/images/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;
