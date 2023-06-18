import Wrapper from "../../../UI/wrapper/wrapper.component";

const TypeUtilisateur = () => {
  return (
    <Wrapper>
      <h2 className="font-bold text-xl">Type d'utilisateur</h2>
      <span>
        <select>
          <option value="">Etudiant</option>
          <option value="">Formateur</option>
          <option value="">Administrateur</option>
          <option value="">Visiteur</option>
        </select>
      </span>
    </Wrapper>
  );
};

export default TypeUtilisateur;
