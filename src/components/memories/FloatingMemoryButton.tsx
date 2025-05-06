"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import MemoryFormModal from "./MemoryFormModal";
import { Memory, addMemory, deleteMemory } from "@/lib/db/memories";
import { getAllFilters, Filter } from "@/lib/db/filters";

export default function FloatingMemoryButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [filters, setFilters] = useState<Filter[]>([]);

  useEffect(() => {
    getAllFilters().then(setFilters);
  }, []);

  const handleSave = async (memory: Omit<Memory, "id"> | Memory) => {
    await addMemory(memory as Omit<Memory, "id">);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    await deleteMemory(id);
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={() => {
          setEditingMemory(null);
          setIsModalOpen(true);
        }}
        className="fixed bottom-6 right-6 z-50 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-transform transform hover:scale-110"
        aria-label="Ajouter un souvenir"
      >
        <Plus className="w-6 h-6" />
      </button>

      <MemoryFormModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleSave}
        {...(editingMemory && { onDelete: handleDelete })}
        initilData={editingMemory || undefined}
        allFilters={filters}
      />
    </>
  );
}
