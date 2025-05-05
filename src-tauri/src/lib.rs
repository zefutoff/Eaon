use tauri_plugin_sql::{Migration, MigrationKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![
        Migration {
            version: 1,
            description: "create_user_info_table",
            sql: "
            CREATE TABLE IF NOT EXISTS user_info (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                birth_date TEXT NOT NULL
            );
            
        ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "create_filters_table",
            sql: "
                CREATE TABLE IF NOT EXISTS filters (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    label TEXT NOT NULL,
                    color TEXT NOT NULL,
                    icon TEXT,
                    position INTEGER NOT NULL DEFAULT 0
                );
        ",
            kind: MigrationKind::Up,
        },
    ];
        tauri::Builder::default()
            .plugin(
                tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:user_info.db", migrations)
                .build())
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
        .run(tauri::generate_context!())
        .expect("Erreur lors du démarrage de l'application Tauri");
}
