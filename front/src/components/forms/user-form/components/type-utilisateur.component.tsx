import {
  ChangeEvent,
  ChangeEventHandler,
  FC,
  RefObject,
  useRef,
  useState,
} from "react";
import Wrapper from "../../../UI/wrapper/wrapper.component";

const TypeUtilisateur: FC<{
  onSubmit: (selectedType: number) => void;
}> = ({ onSubmit }) => {
  const [selectedType, setSelectedType] = useState(0);

  const handleSubmit = () => {
    onSubmit(selectedType);
  };

  const handleCheck: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const checkboxes: any = document.getElementsByClassName("checkbox");
    for (let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = false;
    }
    event.target.checked = true;
    setSelectedType(parseInt(event.target.value) ?? 0);
  };

  return (
    <Wrapper>
      <div className="flex justify-between">
        <h2 className="font-bold text-xl">Type d'utilisateur</h2>
        <button type="button">Gérer les roles</button>
      </div>

      <div className="flex flex-col">
        <span>
          <input
            name="etudiant"
            type="checkbox"
            className="checkbox checkbox-primary"
            onChange={handleCheck}
            value={0}
          />
          <label htmlFor="etudiant">Etudiant</label>
        </span>
        <span>
          <input
            name="formateur"
            type="checkbox"
            className="checkbox checkbox-primary"
            onChange={handleCheck}
            value={1}
          />
          <label htmlFor="formateur">Formateur</label>
        </span>
        <span>
          <input
            name="administrateur"
            type="checkbox"
            className="checkbox checkbox-primary"
            onChange={handleCheck}
            value={2}
          />
          <label htmlFor="administrateur">Administrateur</label>
        </span>
        <span>
          <input
            name="visiteur"
            type="checkbox"
            className="checkbox checkbox-primary"
            onChange={handleCheck}
            value={3}
          />
          <label htmlFor="visiteur">Visiteur</label>
        </span>
      </div>
    </Wrapper>
  );
};

export default TypeUtilisateur;
