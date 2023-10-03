import {
  ChangeEvent,
  ChangeEventHandler,
  Dispatch,
  FC,
  SetStateAction,
} from "react";
import Wrapper from "../../UI/wrapper/wrapper.component";

const TypeUtilisateur: FC<{
  typeUtilisateur: number;
  onSetTypeUtilisateur: Dispatch<SetStateAction<number>>;
}> = ({ typeUtilisateur, onSetTypeUtilisateur }) => {
  const handleCheck: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const checkboxes: any = document.getElementsByClassName("checkbox");
    for (let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = false;
    }
    event.target.checked = true;
    onSetTypeUtilisateur(parseInt(event.target.value) ?? 0);
  };

  return (
    <Wrapper>
      <div className="flex justify-between">
        <h2 className="font-bold text-xl">Type d'utilisateur</h2>
        <button type="button">Gérer les roles</button>
      </div>

      <div className="flex flex-col gap-y-5">
        <span className="flex gap-x-2">
          <input
            name="etudiant"
            type="checkbox"
            className="checkbox checkbox-primary"
            onChange={handleCheck}
            value={0}
            checked={typeUtilisateur === 0}
          />
          <label htmlFor="etudiant">Etudiant</label>
        </span>
        <span className="flex gap-x-2">
          <input
            name="formateur"
            type="checkbox"
            className="checkbox checkbox-primary"
            onChange={handleCheck}
            value={1}
            checked={typeUtilisateur === 1}
          />
          <label htmlFor="formateur">Formateur</label>
        </span>
        <span className="flex gap-x-2">
          <input
            name="administrateur"
            type="checkbox"
            className="checkbox checkbox-primary"
            onChange={handleCheck}
            value={2}
            checked={typeUtilisateur === 2}
          />
          <label htmlFor="administrateur">Administrateur</label>
        </span>
        <span className="flex gap-x-2">
          <input
            name="visiteur"
            type="checkbox"
            className="checkbox checkbox-primary"
            onChange={handleCheck}
            value={3}
            checked={typeUtilisateur === 3}
          />
          <label htmlFor="visiteur">Visiteur</label>
        </span>
      </div>
    </Wrapper>
  );
};

export default TypeUtilisateur;
