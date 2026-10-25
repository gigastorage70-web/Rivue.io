/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@rivue/ui', '@rivue/types', '@rivue/scoring', '@rivue/serper-client', '@rivue/db'],
  serverExternalPackages: ['node:sqlite'],
};

module.exports = nextConfig;
