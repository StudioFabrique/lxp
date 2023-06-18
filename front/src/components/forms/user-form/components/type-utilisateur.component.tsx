import Wrapper from "../../../UI/wrapper/wrapper.component";

const TypeUtilisateur = () => {
  return (
    <Wrapper>
      <h2 className="font-bold text-xl">Type d'utilisateur</h2>
      <div className="flex flex-col">
        <span>
          <input
            name="etudiant"
            type="checkbox"
            className="checkbox checkbox-primary"
          />
          <label htmlFor="etudiant">Etudiant</label>
        </span>
        <span>
          <input
            name="formateur"
            type="checkbox"
            className="checkbox checkbox-primary"
          />
          <label htmlFor="formateur">Formateur</label>
        </span>
        <span>
          <input
            name="administrateur"
            type="checkbox"
            className="checkbox checkbox-primary"
          />
          <label htmlFor="administrateur">Administrateur</label>
        </span>
        <span>
          <input
            name="visiteur"
            type="checkbox"
            className="checkbox checkbox-primary"
          />
          <label htmlFor="visiteur">Visiteur</label>
        </span>
      </div>
    </Wrapper>
  );
};

export default TypeUtilisateur;
