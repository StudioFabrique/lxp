import PasswordUpdateHome from "../components/PasswordUpdateHome";

const ResetPasswordUpdate = () => {
  return (
    <PasswordUpdateHome
      message="Votre mot de passe a bien été réinitialisé."
      title="Réinitialisation du mot de passe"
      description="Veuillez saisir votre nouveau mot de passe ci-dessous."
    />
  );
};

export default ResetPasswordUpdate;
