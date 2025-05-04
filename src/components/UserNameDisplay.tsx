"use client";

import { getUserInfo } from "@/lib/db/user";
import { useEffect, useState } from "react";

export default function UserNameText() {
  const [user, setUser] = useState<{ name: string; birthDate: string } | null>(
    null
  );

  useEffect(() => {
    getUserInfo().then(setUser);
  }, []);

  if (!user) return null;

  return <p>Bienvenu dans tes souvenirs {user.name} !</p>;
}
