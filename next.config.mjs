import { randomBytes } from "crypto";

// If no ENCRYPTION_KEY is provided via env, generate one at build/start time.
if (!process.env.ENCRYPTION_KEY) {
  process.env.ENCRYPTION_KEY = randomBytes(32).toString("base64");
}

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
