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
    <Button onPress={() => window.location.reload()} className={className}>
      {iconPosition === "left" && Icon && <Icon />}
      {title && <span>{title}</span>}
      {iconPosition === "right" && Icon && <Icon />}
    </Button>
  );
}
