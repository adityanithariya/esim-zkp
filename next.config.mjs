/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        NULLIFIER_SEED: process.env.NULLIFIER_SEED,
    }
};

export default nextConfig;
