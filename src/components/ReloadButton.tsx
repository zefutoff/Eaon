"use client";

import { Button } from "@nextui-org/react";
import { RotateCcw, RefreshCw } from "lucide-react";

type AllowedIcons = "RotateCcw" | "RefreshCw";
const iconMap = {
  RotateCcw,
  RefreshCw,
};

type ReloadButtonProps = {
  className?: string;
  iconName?: AllowedIcons;
  title?: string;
  iconPosition?: "left" | "right";
};

export default function ReloadButton({
  className = "",
  iconName = "RotateCcw",
  title,
  iconPosition = "left",
}: ReloadButtonProps) {
  const Icon = iconMap[iconName];

  return (
    <Button
      onPress={() => window.location.reload()}
      className={`min-w-0 p-2 m-0 bg-transparent shadow-none hover:bg-transparent active:scale-90 transition-all duration-200 ${className}`}
      radius="none"
      variant="light"
      isIconOnly={!title}
    >
      {iconPosition === "left" && Icon && (
        <Icon
          className={`${
            title ? "mr-2" : ""
          } transition-transform duration-200 group-hover:rotate-[-15deg]`}
        />
      )}
      {title && <span>{title}</span>}
      {iconPosition === "right" && Icon && (
        <Icon
          className={`${
            title ? "ml-2" : ""
          } transition-transform duration-200 group-hover:rotate-[-15deg]`}
        />
      )}
    </Button>
  );
}
