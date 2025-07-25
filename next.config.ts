// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
    NEXTAUTH_URL: "https://feednix.netlify.app", // required for NextAuth in production
    // Optional: Only add NEXT_PUBLIC_BASE_URL if you are using it in frontend code
    // NEXT_PUBLIC_BASE_URL: "https://feednix.netlify.app",
  },
};

module.exports = nextConfig;
