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

const Certifications: FC<{
  graduations: Array<Graduation>;
  setGraduations: Dispatch<SetStateAction<Graduation[]>>;
}> = ({ graduations, setGraduations }) => {
  const [currentGraduation, setCurrentGraduation] = useState<Graduation>({
    title: "",
    date: new Date(),
    degree: "",
  });

  const handleAddGraduation: MouseEventHandler<HTMLButtonElement> = (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    if (currentGraduation) {
      setGraduations((graduations) => [...graduations, currentGraduation]);
    }
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

  const gridClassName: string =
    graduations.length > 0 ? "grid-cols-2" : "grid-cols-1";

  return (
    <Wrapper>
      <h2 className="font-bold text-xl">Certification(s)</h2>
      <div className={`grid ${gridClassName} gap-x-10`}>
        <div className="flex flex-col gap-y-3">
          <span>
            <label>Titre du diplôme</label>
            <input
              name="title"
              className="input input-sm w-full p-[20px] pl-[30px]"
              type="text"
              onChange={handleInputChange}
              defaultValue={currentGraduation.title}
              autoComplete="off"
            />
          </span>
          <span>
            <label>Niveau du diplôme</label>
            <input
              name="degree"
              className="input input-sm w-full p-[20px] pl-[30px]"
              type="text"
              onChange={handleInputChange}
              defaultValue={currentGraduation.degree}
              autoComplete="off"
            />
          </span>
          <span>
            <label>Date de certification</label>
            <input
              name="date"
              className="input input-sm w-full p-[20px] pl-[30px]"
              type="date"
              onChange={handleInputChange}
              autoComplete="off"
            />
          </span>
          <button
            type="button"
            className="self-start btn btn-primary md:w-32"
            onClick={handleAddGraduation}
          >
            Ajouter la certification
          </button>
        </div>
        {graduations.length > 0 ? (
          <div className="bg-secondary-content flex flex-col items-center gap-y-4 overflow-y-auto max-h-72 p-3 rounded-xl">
            {/* La liste des certifications */}
            {graduations.map((graduation, i) => (
              <span
                key={i}
                className="bg-primary-content rounded-md w-full p-1"
              >
                <p>{graduation.date.getFullYear()}</p>
                <p>{graduation.degree}</p>
              </span>
            ))}
          </div>
        ) : undefined}
      </div>
    </Wrapper>
  );
};

export default Certifications;
