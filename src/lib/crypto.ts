import crypto from "crypto";
import getConfig from "next/config";

// The encryption key can be set manually with an environment variable.
// If no key is set, then the app uses one that was randomly generated at build time.
const getEncryptionKey = () => {
  const key =
    process.env.ENCRYPTION_KEY ||
    getConfig().serverRuntimeConfig.ENCRYPTION_KEY;

  if (typeof key !== "string" || !key.length) throw new Error();

  return key;
};

export const encrypt = (password: string) => {
  const iv = crypto.randomBytes(16).toString("base64");

  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    Buffer.from(getEncryptionKey(), "base64"),
    Buffer.from(iv, "base64")
  );

  const ciphertext =
    cipher.update(password, "utf8", "base64") + cipher.final("base64");

  const tag = cipher.getAuthTag().toString("base64");

  return { ciphertext, iv, tag };
};

export const decrypt = (ciphertext: string, iv: string, tag: string) => {
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    Buffer.from(getEncryptionKey(), "base64"),
    Buffer.from(iv, "base64")
  );

  decipher.setAuthTag(Buffer.from(tag, "base64"));

  const plaintext =
    decipher.update(ciphertext, "base64", "utf8") + decipher.final("utf-8");

  return plaintext;
};
