"use client";
import { Button } from "@nextui-org/react";

export default function ReloadButton() {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <Button className="w-1/2" color="primary" onPress={handleReload}>
      Recharger
    </Button>
  );
}
