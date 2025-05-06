"use client";

import { saveUserInfo } from "@/lib/db/user";
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
import { useState } from "react";

const UserInfoModal = () => {
  const { isOpen, onOpenChange, onClose } = useDisclosure({
    defaultOpen: true,
  });
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState<CalendarDate | null>(null);

  const handleConfirm = async () => {
    if (!name || !birthDate) return;

    const dateStr = `${birthDate.year}-${String(birthDate.month).padStart(
      2,
      "0"
    )}-${String(birthDate.day).padStart(2, "0")}`;

    try {
      await saveUserInfo(name, dateStr);
      onClose();
    } catch (error) {
      console.error(
        "Erreur lors de l'enregistrement des informations utilisateur :",
        error
      );
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
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
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserInfoModal;
