// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod config; 
mod sqlite;
mod bookmarks;
mod process;
mod utils;
mod config_file; 
mod file_cleaner;
mod search;
mod folder_sync;
mod volume_navigator; 

use config::{load_config, save_config}; // Importa las funciones load_config y save_config correctamente
use bookmarks::{get_bookmarks, add_bookmark, delete_bookmark};
use process::{execute_node, get_drives, delete_drive, update_drive};
use file_cleaner::{get_files_in_folder, rename_files_in_folder};
use folder_sync::{sync_folders, get_sync_log};
use volume_navigator::{change_file_system, navigate};
use tauri::command;

#[command]
fn get_config() -> Result<config::Config, String> { // Asegúrate de que el nombre del módulo sea correcto
    println!("Attempting to load config.json...");
    let result = load_config();
    match &result {
        Ok(_) => println!("Config file loaded successfully."),
        Err(e) => eprintln!("Failed to load config file: {}", e),
    }
    result
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            get_drives,
            execute_node,
            delete_drive,
            update_drive,
            get_bookmarks,
            add_bookmark,
            delete_bookmark,
            get_config,
            save_config, 
            get_files_in_folder,
            rename_files_in_folder,
            search::find_files,
            search::open_file_rust,
            search::open_folder_rust,
            sync_folders,
            get_sync_log,
            change_file_system,
            navigate
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
  