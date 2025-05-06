import { getDatabase } from ".";

export type Memory = {
  id: number;
  title: string;
  description?: string;
  date: string;
  image?: string;
  filters: number[];
};

export async function addMemory(memory: Omit<Memory, "id">) {
  const db = await getDatabase();

  const result = await db.execute(
    `INSERT INTO memories (title, description, date, image) VALUES (?1, ?2, ?3, ?4)`,
    [memory.title, memory.description ?? "", memory.date, memory.image ?? ""]
  );

  const memoryId = Number(result.lastInsertId);

  for (const filterId of memory.filters) {
    await db.execute(
      `INSERT INTO memory_filters (memory_id, filter_id) VALUES (?1, ?2)`,
      [memoryId, filterId]
    );
  }

  return memoryId;
}

export type MemoryWithFilters = Omit<Memory, "filters"> & {
  filters: {
    id: number;
    label: string;
    color: string;
    icon?: string;
  }[];
};

export async function getAllMemories(): Promise<MemoryWithFilters[]> {
  const db = await getDatabase();

  const memoriesRaw = await db.select<
    {
      id: number;
      title: string;
      description: string;
      date: string;
      image: string;
    }[]
  >("SELECT * FROM memories ORDER BY date ASC");

  const memories: MemoryWithFilters[] = [];

  for (const mem of memoriesRaw) {
    const filters = await db.select<
      {
        id: number;
        label: string;
        color: string;
        icon: string;
      }[]
    >(
      `
      SELECT f.id, f.label, f.color, f.icon
      FROM filters f
      JOIN memory_filters mf ON mf.filter_id = f.id
      WHERE mf.memory_id = ?1
      `,
      [mem.id]
    );

    memories.push({
      ...mem,
      filters: filters.map((f) => ({
        id: f.id,
        label: f.label,
        color: f.color,
        icon: f.icon || undefined,
      })),
    });
  }

  return memories;
}

export async function deleteMemory(id: number) {
  const db = await getDatabase();

  await db.execute(`DELETE FROM memories WHERE id = ?1`, [id]);
}
