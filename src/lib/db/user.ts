import { getDatabase } from ".";

export type User = { name: string; birthDate: string };

export async function initUserTable() {
  const db = await getDatabase();
  await db.execute(`
        CREATE TABLE IF NOT EXISTS user_info (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            birth_date TEXT NOT NULL
        )
    `);
}

export async function saveUserInfo(user: User) {
  const db = await getDatabase();
  await db.execute(
    `
        INSERT INTO user_info (name, birth_date)
        VALUES (?1, ?2)
    `,
    [user.name, user.birthDate]
  );
}

export async function getUserInfo(): Promise<User | null> {
  const db = await getDatabase();
  const rows = await db.select<{ name: string; birth_date: string }[]>(
    "SELECT name, birth_date FROM user_info LIMIT 1"
  );
  if (rows.length === 0) return null;
  return {
    name: rows[0].name,
    birthDate: rows[0].birth_date,
  };
}
