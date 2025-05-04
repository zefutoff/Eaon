"use client";
import { Button } from "@nextui-org/react";

interface ReloadButtonProps {
  className?: string;
}

export default function ReloadButton({ className }: ReloadButtonProps) {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <Button className={className} color="primary" onPress={handleReload}>
      Recharger
    </Button>
  );
}
