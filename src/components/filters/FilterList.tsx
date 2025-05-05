"use client";

import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import FilterButton from "./FilterButton";
import {
  Filter,
  getAllFilters,
  updateFilter,
  addFilter,
  deleteFilter,
} from "@/lib/db/filters";
import FilterFormModal from "./FilterFormModal";

export default function FilterList() {
  const [filters, setFilters] = useState<Filter[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFilter, setEditingFilter] = useState<Filter | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const refreshFilters = () => {
    getAllFilters().then(setFilters);
  };

  useEffect(() => {
    refreshFilters();
  }, []);

  useEffect(() => {
    const checkScroll = () => {
      const el = scrollRef.current;
      if (el) {
        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
      }
    };

    requestAnimationFrame(() => checkScroll());
  }, [filters]);

  useEffect(() => {
    const checkScroll = () => {
      const el = scrollRef.current;
      if (el) {
        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
      }
    };

    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
    }

    return () => {
      el?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scrollBy = (offset: number) => {
    const el = scrollRef.current;
    if (el) {
      el.scrollBy({
        left: offset,
        top: 0,
        behavior: "smooth",
      } as ScrollToOptions);
    }
  };

  const toggleFilter = (id: number) => {
    setSelectedFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleSave = async (filter: Partial<Filter>) => {
    if ("id" in filter && filter.id !== undefined) {
      await updateFilter(filter as Filter);
    } else {
      await addFilter(filter as Omit<Filter, "id">);
    }
    refreshFilters();
  };

  const handleDelete = async (id: number) => {
    await deleteFilter(id);
    refreshFilters();
  };

  return (
    <div className="w-full flex justify-center mt-6 relative items-center gap-2">
      <button
        onClick={() => scrollBy(-200)}
        disabled={!canScrollLeft}
        className={`p-1 transition ${
          !canScrollLeft ? "opacity-30" : "opacity-100"
        }`}
      >
        <ArrowLeft />
      </button>

      <div
        ref={scrollRef}
        className="relative max-w-[90vw] overflow-x-auto scrollbar-hide flex gap-2 px-4 py-2"
      >
        {filters.map((filter) => (
          <div
            key={filter.id}
            onDoubleClick={() => {
              setEditingFilter(filter);
              setIsModalOpen(true);
            }}
          >
            <FilterButton
              filter={filter}
              selected={selectedFilters.includes(filter.id)}
              onToggle={() => toggleFilter(filter.id)}
            />
          </div>
        ))}

        <button
          className="flex items-center justify-center gap-1 rounded-full border border-dashed border-gray-400 px-4 py-2 text-gray-600 hover:bg-gray-100"
          onClick={() => {
            setEditingFilter(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">Ajouter</span>
        </button>
      </div>

      <button
        onClick={() => scrollBy(200)}
        disabled={!canScrollRight}
        className={`p-1 transition ${
          !canScrollRight ? "opacity-30" : "opacity-100"
        }`}
      >
        <ArrowRight />
      </button>

      <FilterFormModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        mode={editingFilter ? "edit" : "add"}
        initialData={editingFilter || undefined}
        onSave={handleSave}
        onDelete={editingFilter ? handleDelete : undefined}
        existingLabels={filters.map((f) => f.label)}
      />
    </div>
  );
}
