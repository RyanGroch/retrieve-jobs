// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod api;

// Sets up the desktop app
fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![api::list, api::get, api::delete])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
