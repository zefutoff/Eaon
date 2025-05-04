"use client";

import { getUserInfo } from "@/lib/db/user";
import { useEffect, useState } from "react";

interface ReloadButtonProps {
  className?: string;
}

export default function UserNameText( {className }: ReloadButtonProps) {
  const [user, setUser] = useState<{ name: string; birthDate: string } | null>(
    null
  );

  useEffect(() => {
    getUserInfo().then(setUser);
  }, []);

  if (!user) return null;

  return <span className={className}> {user.name}</span>;
}
