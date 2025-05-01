"use client";

import { useEffect, useState } from "react";
import { getUserInfo, initUserInfoDatabase } from "@/lib/db/user-info-store";
import UserInfoModal from "./UserInfoModal";

export default function UserInfoLoader() {
  const [shouldShowModal, setShouldShowModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        await initUserInfoDatabase();
        const user = await getUserInfo();
        if (!user) {
          setShouldShowModal(true);
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement des infos utilisateur:",
          error
        );
        setShouldShowModal(true);
      }
    };

    load();
  }, []);

  if (!shouldShowModal) return null;
  return <UserInfoModal />;
}
