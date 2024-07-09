import { randomBytes } from "crypto";

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output:
    process.env.TAURI && process.env.NODE_ENV !== "development"
      ? "export"
      : undefined,
  serverRuntimeConfig: {
    ENCRYPTION_KEY: randomBytes(32).toString("base64")
  },
  headers: process.env.TAURI
    ? undefined
    : async () => [
        {
          source: "/(.*)",
          headers: [
            {
              key: "Content-Security-Policy",
              value: cspHeader.replace(/\n/g, "")
            }
          ]
        }
      ]
};

export default nextConfig;
