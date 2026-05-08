// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod api;
mod password_storage;

// Sets up the desktop app
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            api::list,
            api::get,
            api::delete,
            api::logout
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
