// Determines whether we are in web mode or desktop mode.
// If we are in desktop mode, returns an object that
// allows the app to call Rust functions.

// From the Tauri documentation:
// https://tauri.app/v1/guides/getting-started/setup/integrate/#using-withglobaltauri

export const getTauri = () =>
  typeof window !== undefined && "__TAURI__" in window
    ? (window.__TAURI__ as any)
    : null;
