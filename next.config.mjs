/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.TAURI ? "export" : undefined
};

export default nextConfig;
