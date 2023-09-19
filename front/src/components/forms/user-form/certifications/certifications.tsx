// import attributeChange from "../../../../utils/attributeChange";

import {
  ChangeEvent,
  ChangeEventHandler,
  Dispatch,
  FC,
  MouseEvent,
  MouseEventHandler,
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
}> = ({ graduations, setGraduations }) => {
  const [currentGraduation, setCurrentGraduation] = useState<Graduation>({
    title: "",
    date: new Date(),
    degree: "",
  });

  const handleAddGraduation = () => {
    if (
      currentGraduation.date &&
      currentGraduation.degree &&
      currentGraduation.title
    ) {
      setGraduations((graduations) =>
        addIdToObject([...graduations, currentGraduation])
      );
    }
  };

  const handleDeleteGraduation = (id: number) => {
    setGraduations((graduations) =>
      graduations.filter((graduation) => graduation.id !== id)
    );
  };

  /* 
    Récupère la valeur de l'attribut "name" lors de l'évenement du changement de l'input (texte ou date) puis
    en fonction de cette valeur, change la propriété de l'objet ayant le nom de cette valeur de l'attribut "name"
  */
  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
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
    /* attributeChange(event, currentGraduation, setCurrentGraduation); */
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
                defaultValue={currentGraduation.title}
                autoComplete="off"
              />
            </span>
            <span className="flex flex-col gap-y-2">
              <label>Niveau du diplôme</label>
              <input
                name="degree"
                className="input input-sm input-bordered focus:outline-none w-full"
                type="text"
                onChange={handleInputChange}
                defaultValue={currentGraduation.degree}
                autoComplete="off"
              />
            </span>
            <span className="flex flex-col gap-y-2">
              <label>Date de certification</label>
              <input
                name="date"
                className="input input-sm input-bordered focus:outline-none w-full"
                type="date"
                onChange={handleInputChange}
                autoComplete="off"
              />
            </span>
          </div>
          <button
            type="button"
            className="mt-2 normal-case self-start btn btn-primary"
            onClick={handleAddGraduation}
          >
            Ajouter la certification
          </button>
        </div>
        <div className="bg-secondary-content flex flex-col items-center gap-y-4 p-5 m-2 rounded-xl md:h-[300px] lg:h-[400px] overflow-y-auto">
          {/* List of certifications */}
          {graduations.map((graduation) => (
            <CertificationItem
              key={graduation.id}
              onDelete={handleDeleteGraduation}
              graduation={graduation}
            />
          ))}
        </div>
      </div>
    </Wrapper>
  );
};

export default Certifications;
