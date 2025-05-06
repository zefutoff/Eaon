import { Filter } from "@/lib/db/filters";
import { Memory } from "@/lib/db/memories";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (memory: Omit<Memory, "id"> | Memory) => void;
  onDelete?: (id: number) => void | Promise<void>;

  initilData?: Memory;
  allFilters: Filter[];
};

export default function MemoryFormModal({
  isOpen,
  onOpenChange,
  onSave,
  onDelete,
  initilData,
  allFilters,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (initilData) {
      setTitle(initilData.title);
      setDescription(initilData.description || "");
      setDate(initilData.date);
      setImage(initilData.image || "");
      setSelectedFilters(initilData.filters || []);
    } else {
      setTitle("");
      setDescription("");
      setDate("");
      setImage("");
      setSelectedFilters([]);
    }
  }, [initilData, isOpen]);

  const handleSubmit = () => {
    setSubmitted(true);
    if (!title.trim() || !date) return;

    const memory: Omit<Memory, "id"> | Memory = {
      ...(initilData ?? {}),
      title: title.trim(),
      description: description.trim(),
      date,
      image: image.trim(),
      filters: selectedFilters,
    };

    onSave(memory);
    setSubmitted(false);
  };

  const toogleFilter = (id: number) => {
    setSelectedFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="lg"
      backdrop="blur"
    >
      <ModalContent>
        {(onclose) => (
          <>
            <ModalHeader>
              {initilData ? "Modifier un souvenir" : "Ajouter un souvenir"}
            </ModalHeader>
            <ModalBody>
              <Input
                label="Titre"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                isInvalid={submitted && !title.trim()}
                errorMessage={
                  submitted && !title.trim() ? "Titre requis" : undefined
                }
              />
              <Textarea
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Input
                label="Date"
                type="date"
                onChange={(e) => setImage(e.target.value)}
              />

              <div className="flex flex-wrap gap-2 mt-2">
                {allFilters.map((filter) => {
                  const selected = selectedFilters.includes(filter.id);

                  return (
                    <button
                      key={filter.id}
                      className={`px-3 py-1 rounded-full text-sm border ${
                        selected
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                      style={{ borderColor: selected ? filter.color : "#ccc" }}
                      onClick={() => toogleFilter(filter.id)}
                      type="button"
                    >
                      {filter.icon} {filter.label}
                    </button>
                  );
                })}
              </div>
            </ModalBody>
            <ModalFooter className="justify-between">
              {initilData && onDelete && (
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    onDelete(initilData.id);
                    onOpenChange(false);
                  }}
                  startContent={<Trash2 className="w-4 h-4" />}
                >
                  Supprimer
                </Button>
              )}
              <div className="flex gap-2">
                <Button variant="light" onPress={onclose}>
                  Annuler
                </Button>
                <Button color="primary" onPress={handleSubmit}>
                  {initilData ? "Enregistrer" : "Ajouter"}
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
