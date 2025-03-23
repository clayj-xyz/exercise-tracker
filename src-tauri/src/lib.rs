use std::fs;
use std::path::PathBuf;
extern crate dirs;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn read_program() -> Result<String, String> {
    let path = dirs::home_dir()
        .unwrap()
        .join(".local/share/exercise-tracker/data/program.json");
    fs::read_to_string(path).map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, read_program])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
