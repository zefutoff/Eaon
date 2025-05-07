"use client";

import { Filter } from "@/lib/db/filters";
import { hexToRgba } from "@/lib/utils/color";

type FilterButtonProps = {
  filter: Filter;
  selected: boolean;
  onToggle: () => void;
};

export default function FilterButton({
  filter,
  selected,
  onToggle,
}: FilterButtonProps) {
  const color = filter.color || "#3b82f6";

  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 text-sm"
      style={{
        backgroundColor: selected ? color : "transparent",
        color: selected ? "white" : color,
        borderColor: color,
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          (e.currentTarget as HTMLElement).style.backgroundColor = hexToRgba(
            color,
            0.25
          );
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          (e.currentTarget as HTMLElement).style.backgroundColor =
            "transparent";
        }
      }}
    >
      {filter.icon && <span className="text-lg">{filter.icon}</span>}
      <span>{filter.label}</span>
    </button>
  );
}
