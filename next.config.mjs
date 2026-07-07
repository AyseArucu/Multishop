/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma', 'bcryptjs', 'iyzipay']
  }
};

export default nextConfig;
