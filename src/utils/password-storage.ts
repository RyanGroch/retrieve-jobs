import { encrypt, decrypt } from "@/lib/crypto";
import { cookies } from "next/headers";

// These functions all run on the server of the web version only.
// They manage the storage of the password, and call the
// functions to encrypt and decrypt the password as appropriate.

// Settings for cookies (i.e. password storage)
const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict", // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
  maxAge: 7 * 24 * 60 * 60 * 1000, // Lasts one week
  path: "/"
} as const;

export const getStoredPassword = () => {
  const cookieStore = cookies();
  const [encryptedPassword, iv, tag] = [
    cookieStore.get("password"),
    cookieStore.get("iv"),
    cookieStore.get("tag")
  ];

  if (!(encryptedPassword && iv && tag)) {
    return null;
  }

  return decrypt(encryptedPassword.value, iv.value, tag.value);
};

export const setStoredPassword = (password: string) => {
  const cookieStore = cookies();
  const { ciphertext, iv, tag } = encrypt(password);

  cookieStore.set("password", ciphertext, options);
  cookieStore.set("iv", iv, options);
  cookieStore.set("tag", tag, options);
};

export const deleteStoredPassword = () => {
  const cookieStore = cookies();

  cookieStore.delete("password");
  cookieStore.delete("iv");
  cookieStore.delete("tag");
};
