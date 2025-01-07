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
import { invoke } from "@tauri-apps/api/core";

const UserInfoModal = () => {
  const { isOpen, onOpenChange } = useDisclosure({ defaultOpen: true });
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState<CalendarDate | null>(null);

  const handleConfirm = async () => {
    const userInfo = JSON.stringify({
      name,
      birthDate: birthDate ? birthDate.toString() : "",
    });

    try {
      await invoke("save_file", { fileName: "user-info", data: userInfo });
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
