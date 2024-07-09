import { getTauri } from "@/lib/tauri";
import type {
  Credentials,
  FTPSuccessResult,
  FTPFailResult,
  FTPResult
} from "./types";

// FTP requests cannot occur on the frontend (i.e. in the browser).
// The functions in this file detect whether the app is in web
// or desktop mode, and then make a call to the correct
// backend (based on whether we are in web or desktop mode)
// where the FTP request will occur.

// The exception is of course the `logout` function,
// which does not make an FTP request but does
// clear cookies and storage.

// Lists jobs.
export const FTPlist = async (
  credentials: Credentials,
  storePassword: boolean
): Promise<FTPResult> => {
  try {
    const tauri = getTauri();
    if (tauri) {
      // Desktop mode
      const result = await tauri.invoke("list", {
        ...credentials,
        storePassword
      });
      return {
        success: true,
        result
      } as FTPSuccessResult;
    }

    // Web mode
    const response = await fetch("/api/list", {
      method: "POST",
      body: JSON.stringify({
        host: credentials.host,
        username: credentials.username,
        password: credentials.password,
        storePassword
      })
    });

    const data = (await response.json()) as FTPSuccessResult;
    return data;
  } catch {
    return { success: false } as FTPFailResult;
  }
};

// Gets the contents of a specific job.
export const FTPget = async (
  credentials: Credentials,
  job: string
): Promise<FTPResult> => {
  try {
    const tauri = getTauri();
    if (tauri) {
      // Desktop mode
      const result = await tauri.invoke("get", { ...credentials, job });
      return {
        success: true,
        result
      } as FTPSuccessResult;
    }

    // Web mode
    const response = await fetch("/api/get", {
      method: "POST",
      body: JSON.stringify({
        host: credentials.host,
        username: credentials.username,
        password: credentials.password,
        job
      })
    });

    const data = (await response.json()) as FTPSuccessResult;
    return data;
  } catch {
    return { success: false } as FTPFailResult;
  }
};

// Deletes one or more jobs.
export const FTPdelete = async (
  credentials: Credentials,
  jobs: string[]
): Promise<FTPResult> => {
  try {
    const tauri = getTauri();
    if (tauri) {
      // Desktop mode
      const result = await tauri.invoke("delete", { ...credentials, jobs });
      return {
        success: true,
        result
      } as FTPSuccessResult;
    }

    // Web mode
    const response = await fetch("/api/delete", {
      method: "POST",
      body: JSON.stringify({
        host: credentials.host,
        username: credentials.username,
        password: credentials.password,
        jobs
      })
    });

    const data = (await response.json()) as FTPSuccessResult;
    return data;
  } catch {
    return { success: false } as FTPFailResult;
  }
};

// Deletes the password; clears storage & cookies/keyring.
export const logout = () => {
  const tauri = getTauri();

  localStorage.removeItem("host");
  localStorage.removeItem("username");
  localStorage.removeItem("password"); // legacy, can remove later

  if (tauri) {
    tauri.invoke("logout");
  } else {
    fetch("/api/logout", {
      method: "POST"
    });
  }
};
