import { ChangeEvent, ChangeEventHandler, FC, useState } from "react";
import Wrapper from "../../../UI/wrapper/wrapper.component";
import Graduation from "../../../../utils/interfaces/graduation";
import { toast } from "react-hot-toast";

const Certifications: FC<{
  onAddGraduation: (graduation: Graduation) => void;
}> = ({ onAddGraduation }) => {
  const [currentGraduation, setCurrentGraduation] = useState<Graduation>();

  const handleAddGraduation = () => {
    if (currentGraduation) {
      onAddGraduation(currentGraduation);
    }
  };

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const name = event.currentTarget.getAttribute("name");
    switch (name) {
      case "title":
        setCurrentGraduation({
          title: event.currentTarget.value,
          degree: currentGraduation!.degree,
          date: currentGraduation!.date,
        });
        break;
      case "degree":
        setCurrentGraduation({
          title: currentGraduation!.title,
          degree: event.currentTarget.value,
          date: currentGraduation!.date,
        });
        break;
      case "date":
        setCurrentGraduation({
          title: currentGraduation!.title,
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
      <h2 className="font-bold text-xl">Certifications</h2>
      <span>
        <label>Titre du diplôme</label>
        <input
          name="title"
          className="input input-sm w-full p-[20px] pl-[30px]"
          type="text"
          onChange={handleInputChange}
          defaultValue={currentGraduation?.title}
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
          defaultValue={currentGraduation?.degree}
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
          defaultValue={currentGraduation?.date.toDateString()}
          autoComplete="off"
        />
      </span>
      <button type="button" onClick={handleAddGraduation}>
        Ajouter la certification
      </button>
      <div>{/* liste graduation */}</div>
    </Wrapper>
  );
};

export default Certifications;
