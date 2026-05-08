// Determines whether we are running in desktop (Tauri) mode
// or web mode. The Tauri runtime injects __TAURI_INTERNALS__
// into the window when the app is loaded inside the WebView.

export const isTauri = () =>
  typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
