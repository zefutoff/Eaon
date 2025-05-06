"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
  Input,
} from "@nextui-org/react";

import { useState, useEffect } from "react";
import { Filter } from "@/lib/db/filters";
import { Trash2 } from "lucide-react";

type FilterFormModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (filter: Omit<Filter, "id"> | Filter) => void;
  onDelete?: (id: number) => void;
  mode: "add" | "edit";
  initialData?: Filter;
  existingLabels: string[];
};

export default function FilterFormModal({
  isOpen,
  onOpenChange,
  onSave,
  onDelete,
  mode,
  initialData,
  existingLabels,
}: FilterFormModalProps) {
  const [label, setLabel] = useState("");
  const [color, setColor] = useState("#38bdf8");
  const [icon, setIcon] = useState("");
  const [position, setPosition] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (initialData) {
      setLabel(initialData.label);
      setColor(initialData.color);
      setIcon(initialData.icon || "");
      setPosition(initialData.position);
    } else {
      setLabel("");
      setColor("#38bdf8");
      setIcon("");
      setPosition(0);
    }
    setSubmitted(false);
  }, [initialData, isOpen]);

  const isDuplicate = existingLabels
    .filter((l) => l !== initialData?.label)
    .some((l) => l.toLowerCase() === label.trim().toLowerCase());

  const handleSubmit = () => {
    setSubmitted(true);
    if (!label.trim() || isDuplicate) return;

    const filter: Omit<Filter, "id"> | Filter = {
      ...(initialData ?? {}),
      label,
      color,
      icon,
      position,
    };
    onSave(filter);
    onOpenChange(false);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        size="sm"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {mode === "add" ? "Ajouter un filtre" : "Modifier le filtre"}
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Nom"
                  placeholder="Ex: Santé"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  isInvalid={submitted && (!label.trim() || isDuplicate)}
                  errorMessage={
                    submitted && !label.trim()
                      ? "Le nom est requis"
                      : submitted && isDuplicate
                      ? "Ce nom est déjà utilisé"
                      : undefined
                  }
                />
                <Input
                  type="color"
                  label="Couleur"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
                <Input
                  label="Icône"
                  placeholder="Ex: 😄"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  maxLength={1}
                />
              </ModalBody>
              <ModalFooter className="justify-between">
                {mode === "edit" && initialData && onDelete && (
                  <Button
                    color="danger"
                    variant="light"
                    onPress={() => {
                      onDelete(initialData.id);
                      onClose();
                    }}
                    startContent={<Trash2 className="w-4 h-4" />}
                  >
                    Supprimer
                  </Button>
                )}
                <div className="flex gap-2">
                  <Button variant="light" onPress={onClose}>
                    Annuler
                  </Button>
                  <Button color="primary" onPress={handleSubmit}>
                    {mode === "add" ? "Ajouter" : "Enregistrer"}
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
