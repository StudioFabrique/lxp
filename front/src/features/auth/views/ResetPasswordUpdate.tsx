import PasswordUpdateHome from "../components/PasswordUpdateHome";

const ResetPasswordUpdate = () => {
  return (
    <div className="flex flex-col flex-1 w-full">
      <div className="flex flex-col gap-4 my-auto w-full">
        <PasswordUpdateHome
          message="Votre mot de passe a bien été réinitialisé."
          title="Réinitialisation du mot de passe"
          description="Veuillez saisir votre nouveau mot de passe ci-dessous."
        />
      </div>
    </div>
  );
};

export default ResetPasswordUpdate;
