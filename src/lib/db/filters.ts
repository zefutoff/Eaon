import { getDatabase } from ".";

export type Filter = {
  id: number;
  label: string;
  color: string;
  icon?: string;
  position: number;
};

export async function getAllFilters(): Promise<Filter[]> {
  const db = await getDatabase();
  const results = await db.select<Filter[]>(
    `SELECT id, label, color, icon, position FROM filters ORDER BY position`
  );
  return results;
}

export async function addFilter(filter: Omit<Filter, "id">): Promise<void> {
  const db = await getDatabase();
  await db.execute(
    `INSERT INTO filters (label, color, icon, position) VALUES (?1, ?2, ?3, ?4)`,
    [filter.label, filter.color, filter.icon ?? null, filter.position]
  );
}

export async function deleteFilter(id: number): Promise<void> {
  const db = await getDatabase();
  await db.execute(`DELETE FROM filters WHERE id = ?1`, [id]);
}

export async function updateFilter(filter: Filter): Promise<void> {
  const db = await getDatabase();
  await db.execute(
    `UPDATE filters SET label = ?1, color = ?2, icon = ?3, position = ?4 WHERE id = ?5`,
    [
      filter.label,
      filter.color,
      filter.icon ?? null,
      filter.position,
      filter.id,
    ]
  );
}
