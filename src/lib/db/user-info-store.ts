import Database from "@tauri-apps/plugin-sql";

let db: Database;

export async function initUserInfoDatabase() {
  db = await Database.load("sqlite:user_info.db");
  await db.execute(`
        CREATE TABLE IF NOT EXISTS user_info (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            birth_date TEXT NOT NULL
        )
    `);
}

export async function saveUserInfo(name: string, birthDate: string) {
  await db.execute(
    `
        INSERT INTO user_info (name, birth_date)
        VALUES (?, ?)
    `,
    [name, birthDate]
  );
}

export async function getUserInfo() {
  const result = await db.select<{ name: string; birth_date: string }[]>(
    "SELECT name, birth_date FROM user_info LIMIT 1"
  );

  if (result.length === 0) return null;

  const row = result[0] as { name: string; birth_date: string };
  return {
    name: row.name,
    birthDate: row.birth_date,
  };
}
