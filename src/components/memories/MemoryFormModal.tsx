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
  const [search, setSearch] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

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
              <Input
                label="Image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />

              <div className="mt-4">
                <Input
                  label="Rechercher un filtre"
                  placeholder="Tape un mot-clé"
                  value={search}
                  onFocus={() => setIsSearchActive(true)}
                  onBlur={() => setTimeout(() => setIsSearchActive(false), 100)}
                  onChange={(e) => setSearch(e.target.value)}
                  className="mb-2"
                />

                <div className="relative mt-2 h-0">
                  <div
                    className={`absolute w-full z-10 bg-white shadow-lg border border-grey-400 rounded-md max-h-32 overflow-y-auto p-2 flex flex-wrap gap-2 transition-all duration-300 ease-in-out transform ${
                      isSearchActive
                        ? "opacity-100 scale-100 pointer-events-auto"
                        : "opacity-0 scale-95 pointer-events-none"
                    }`}
                  >
                    {allFilters
                      .filter(
                        (f) =>
                          !selectedFilters.includes(f.id) &&
                          f.label.toLowerCase().includes(search.toLowerCase())
                      )
                      .map((filter) => (
                        <button
                          key={filter.id}
                          onClick={() => {
                            setSelectedFilters([...selectedFilters, filter.id]);
                            setSearch("");
                          }}
                          className="text-sm px-3 py-1 rounded-full border"
                          style={{
                            borderColor: filter.color,
                            color: filter.color,
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = hexToRgba(
                              filter.color,
                              0.1
                            ))
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "transparent")
                          }
                        >
                          <span className="inline-block max-w-[190px] overflow-hidden text-ellipsis whitespace-nowrap">
                            {filter.icon} {filter.label}
                          </span>
                        </button>
                      ))}

                    {allFilters.filter(
                      (f) =>
                        !selectedFilters.includes(f.id) &&
                        f.label.toLowerCase().includes(search.toLowerCase())
                    ).length === 0 && (
                      <div className="text-sm text-gray-400 text-center w-full">
                        Aucun filtre trouvé
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedFilters.length > 0 && (
                <>
                  <p className="text-sm text-gray-500 mb-1">
                    Filtres sélectionnés :
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedFilters.map((id) => {
                      const filter = allFilters.find((f) => f.id === id);
                      if (!filter) return null;
                      return (
                        <span
                          key={id}
                          className="flex items-center text-sm px-3 py-1 rounded-full text-white"
                          style={{ backgroundColor: filter.color }}
                        >
                          <span className="mr-1 inline-block max-w-[160px] overflow-hidden text-ellipsis whitespace-nowrap">
                            {filter.icon} {filter.label}
                          </span>
                          <button
                            onClick={() =>
                              setSelectedFilters((prev) =>
                                prev.filter((f) => f !== id)
                              )
                            }
                            className="ml-1 text-white hover:text-gray-200 font-bold"
                          >
                            x
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </>
              )}
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
