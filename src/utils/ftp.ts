import { getTauri } from "@/lib/tauri";
import { type Credentials } from "./types";

// FTP requests cannot occur on the frontend (i.e. in the browser).
// The functions in this file detect whether the app is in web
// or desktop mode, and then make a call to the correct
// backend (based on whether we are in web or desktop mode)
// where the FTP request will occur.

// Lists jobs.
export const FTPlist = async (credentials: Credentials) => {
  try {
    const tauri = getTauri();
    if (tauri) {
      // Desktop mode
      const result = await tauri.invoke("list", credentials);
      return {
        success: true,
        result
      };
    }

    // Web mode
    const response = await fetch("/api/list", {
      method: "POST",
      body: JSON.stringify({
        host: credentials.host,
        username: credentials.username,
        password: credentials.password
      })
    });

    const data = await response.json();
    return data;
  } catch {
    return { success: false };
  }
};

// Gets the contents of a specific job.
export const FTPget = async (credentials: Credentials, job: string) => {
  try {
    const tauri = getTauri();
    if (tauri) {
      // Desktop mode
      const result = await tauri.invoke("get", { ...credentials, job });
      return {
        success: true,
        result
      };
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

    const data = await response.json();
    return data;
  } catch {
    return { success: false };
  }
};

// Deletes one or more jobs.
export const FTPdelete = async (credentials: Credentials, jobs: string[]) => {
  try {
    const tauri = getTauri();
    if (tauri) {
      // Desktop mode
      const result = await tauri.invoke("delete", { ...credentials, jobs });
      return {
        success: true,
        result
      };
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

    const data = await response.json();
    return data;
  } catch {
    return { success: false };
  }
};
