"use client";

import { CalendarDate, parseDate } from "@internationalized/date";
import {
  Modal,
  Input,
  ModalHeader,
  ModalBody,
  Button,
  ModalContent,
  ModalFooter,
  useDisclosure,
  DateInput,
} from "@nextui-org/react";
import { writeTextFile } from "@tauri-apps/plugin-fs";
import { BaseDirectory } from "@tauri-apps/api/path";
import { useState } from "react";

const UserInfoModal = () => {
  const { isOpen, onOpenChange } = useDisclosure({ defaultOpen: true });
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState<CalendarDate | null>(null);

  const handleConfirm = async () => {
    const userInfo = { name, birthDate };

    try {
      await writeTextFile("user-info.txt", JSON.stringify(userInfo), {
        baseDir: BaseDirectory.AppData, //Renvoi à la racine du dossier Roaming de AppDate de l'utilisateur pas bon aller dans le dossier de l'application
      });
      onOpenChange();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {
            <>
              <ModalHeader className="flex flex-col gap-1">
                Bienvenue !
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Prénom"
                  placeholder="Entre ton prénom"
                  variant="bordered"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <DateInput
                  label="Date de naissance"
                  value={birthDate}
                  onChange={(date) => setBirthDate(date)}
                  defaultValue={parseDate("2002-08-06")}
                  placeholderValue={new CalendarDate(1995, 11, 6)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={handleConfirm}>
                  C&apos;est parti !
                </Button>
              </ModalFooter>
            </>
          }
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserInfoModal;
