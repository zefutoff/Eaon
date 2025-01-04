use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            let app_handle = app.handle();

            // Création du dossier de données de l'application
            if let Ok(app_data_path) = app_handle.path().app_data_dir() {
                if !app_data_path.exists() {
                    std::fs::create_dir_all(&app_data_path)
                        .map_err(|e| {
                            eprintln!("Erreur lors de la création du dossier 'Eaon': {}", e);
                        })
                        .ok();
                }
            }

            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
