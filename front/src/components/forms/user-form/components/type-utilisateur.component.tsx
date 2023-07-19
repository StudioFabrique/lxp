import { ChangeEvent, ChangeEventHandler, RefObject, useRef } from "react";
import Wrapper from "../../../UI/wrapper/wrapper.component";

const TypeUtilisateur = () => {
  const handleCheck: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const checkboxes: any = document.getElementsByClassName("checkbox");
    for (let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = false;
    }
    event.target.checked = true;
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
          />
          <label htmlFor="etudiant">Etudiant</label>
        </span>
        <span>
          <input
            name="formateur"
            type="checkbox"
            className="checkbox checkbox-primary"
            onChange={handleCheck}
          />
          <label htmlFor="formateur">Formateur</label>
        </span>
        <span>
          <input
            name="administrateur"
            type="checkbox"
            className="checkbox checkbox-primary"
            onChange={handleCheck}
          />
          <label htmlFor="administrateur">Administrateur</label>
        </span>
        <span>
          <input
            name="visiteur"
            type="checkbox"
            className="checkbox checkbox-primary"
            onChange={handleCheck}
          />
          <label htmlFor="visiteur">Visiteur</label>
        </span>
      </div>
    </Wrapper>
  );
};

export default TypeUtilisateur;
