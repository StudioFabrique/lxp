import {
  ChangeEvent,
  ChangeEventHandler,
  Dispatch,
  FC,
  SetStateAction,
  useState,
} from "react";
import Wrapper from "../../../UI/wrapper/wrapper.component";
import Graduation from "../../../../utils/interfaces/graduation";
import { toast } from "react-hot-toast";
import CertificationItem from "./certification-item";
import { addIdToObject } from "../../../../utils/add-id-to-objects";

const Certifications: FC<{
  graduations: Array<Graduation>;
  setGraduations: Dispatch<SetStateAction<Graduation[]>>;
  disabled?: boolean;
}> = ({ graduations, setGraduations, disabled }) => {
  const initGraduation = {
    title: "",
    date: new Date(),
    degree: "",
  };

  const [currentGraduation, setCurrentGraduation] =
    useState<Graduation>(initGraduation);

  const [editMode, setEditMode] = useState<{
    isActive: boolean;
    idToEdit: number | null;
    _idToEdit: string | null;
  }>({
    isActive: false,
    idToEdit: null,
    _idToEdit: null,
  });

  const handleAddGraduation = () => {
    if (
      currentGraduation.date &&
      currentGraduation.degree &&
      currentGraduation.title
    ) {
      setGraduations((prevGraduations) =>
        addIdToObject([...prevGraduations, currentGraduation]),
      );

      setCurrentGraduation(initGraduation);
    }
  };

  const handleSetEditMode = (graduation: Graduation) => {
    if (!graduation.id && !graduation._id) return;
    setCurrentGraduation(graduation);
    setEditMode(
      graduation._id
        ? { isActive: true, idToEdit: null, _idToEdit: graduation._id }
        : { isActive: true, idToEdit: graduation.id ?? null, _idToEdit: null },
    );
  };

  const handleEditGraduation = () => {
    if (
      currentGraduation.date &&
      currentGraduation.degree &&
      currentGraduation.title
    ) {
      setGraduations((prevGraduations) =>
        prevGraduations.map((item) =>
          editMode._idToEdit
            ? item._id === editMode._idToEdit
              ? { ...item, ...currentGraduation }
              : item
            : item.id === editMode.idToEdit
              ? { ...item, ...currentGraduation }
              : item,
        ),
      );

      setCurrentGraduation(initGraduation);
      setEditMode((prevEditMode) => ({ ...prevEditMode, isActive: false }));
    }
  };

  const handleDeleteGraduation = (id: number) => {
    setGraduations((prevGraduations) =>
      prevGraduations.filter((item) => item.id !== id),
    );
    setCurrentGraduation(initGraduation);
    setEditMode((prevEditMode) => ({ ...prevEditMode, isActive: false }));
  };

  /*
    Récupère la valeur de l'attribut "name" lors de l'évenement du changement de l'input (texte ou date) puis
    en fonction de cette valeur, change la propriété de l'objet ayant le nom de cette valeur de l'attribut "name"
  */
  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const name = event.currentTarget.getAttribute("name");
    switch (name) {
      case "title":
        setCurrentGraduation({
          title: event.currentTarget.value,
          degree: currentGraduation?.degree ?? "",
          date: currentGraduation?.date ?? new Date(),
        });
        break;
      case "degree":
        setCurrentGraduation({
          title: currentGraduation?.title ?? "",
          degree: event.currentTarget.value,
          date: currentGraduation?.date ?? new Date(),
        });
        break;
      case "date":
        setCurrentGraduation({
          title: currentGraduation?.title ?? "",
          degree: currentGraduation!.degree,
          date: new Date(event.currentTarget.value),
        });
        break;
      default:
        toast("error");
        break;
    }
  };

  return (
    <Wrapper>
      <div className="grid grid-cols-2 gap-x-10">
        <div className="flex flex-col justify-between">
          <div className="flex flex-col justify-between gap-y-3">
            <h2 className="font-bold text-xl">Certification(s)</h2>
            <span className="flex flex-col gap-y-2">
              <label>Titre du diplôme</label>
              <input
                name="title"
                className="input input-sm input-bordered focus:outline-none w-full"
                type="text"
                onChange={handleInputChange}
                value={currentGraduation.title}
                autoComplete="off"
                disabled={disabled}
              />
            </span>
            <span className="flex flex-col gap-y-2">
              <label>Niveau du diplôme</label>
              <input
                name="degree"
                className="input input-sm input-bordered focus:outline-none w-full"
                type="text"
                onChange={handleInputChange}
                value={currentGraduation.degree}
                autoComplete="off"
                disabled={disabled}
              />
            </span>
            <span className="flex flex-col gap-y-2">
              <label>Date de certification</label>
              <input
                name="date"
                className="input input-sm input-bordered focus:outline-none w-full"
                type="date"
                value={
                  new Date(currentGraduation.date).toISOString().split("T")[0]
                }
                onChange={handleInputChange}
                autoComplete="off"
                disabled={disabled}
              />
            </span>
          </div>
          {editMode.isActive ? (
            <button
              type="button"
              className="mt-2 normal-case self-start btn btn-primary"
              onClick={handleEditGraduation}
              disabled={disabled}
            >
              Modifier la certification
            </button>
          ) : (
            <button
              type="button"
              className="mt-2 normal-case self-start btn btn-primary"
              onClick={handleAddGraduation}
              disabled={disabled}
            >
              Ajouter la certification
            </button>
          )}
        </div>
        <div className="bg-secondary/10 flex flex-col items-center gap-y-4 p-5 m-2 rounded-xl md:h-[300px] lg:h-[400px] overflow-y-auto">
          {/* List of certifications */}
          {graduations.map((graduation) => (
            <CertificationItem
              key={graduation._id ? graduation.id : graduation._id}
              onDelete={handleDeleteGraduation}
              graduation={graduation}
              onSetEditMode={handleSetEditMode}
            />
          ))}
        </div>
      </div>
    </Wrapper>
  );
};

export default Certifications;
