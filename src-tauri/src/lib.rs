use serde::{Deserialize, Serialize};
use std::io::Write;
use std::{fs::File, path::PathBuf};
use tauri::{AppHandle, Manager};

#[derive(Serialize, Deserialize)]
struct UserInfo {
    name: String,
    birth_date: String,
}

#[tauri::command]
fn save_file(app_handle: AppHandle, file_name: String, data: String) -> Result<(), String> {
    // Obtenir le répertoire de l'application
    let app_dir: PathBuf = app_handle.path().app_data_dir().map_err(|_| {
        "Impossible de trouver le répertoire des données de l'application".to_string()
    })?; // Propagation de l'erreur avec un message personnalisé

    let file_path = app_dir.join(file_name);

    // Ecriture des données dans le fichier
    let mut file =
        File::create(&file_path).map_err(|e| format!("Erreur création fichier : {}", e))?;
    file.write_all(data.as_bytes())
        .map_err(|e| format!("Erreur écriture : {}", e))?;

    println!("Fichier enregistré à : {:?}", file_path);
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![save_file])
        .run(tauri::generate_context!())
        .expect("Erreur lors du démarrage de l'application Tauri");
}
