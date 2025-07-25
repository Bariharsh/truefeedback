// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
   env: {
     NEXT_PUBLIC_BASE_URL: process.env.NEXTAUTH_URL,
   },
};

module.exports = nextConfig;
