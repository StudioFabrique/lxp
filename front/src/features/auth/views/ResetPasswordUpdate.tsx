/**
 * Cette vue permet de réinitialiser le mot de passe du
 * compte d'un utilisateur.
 */

import PasswordUpdateHome from "../../../../src.legacy/components/password-update/password-update-home";

export default function ResetPasswordUpdate() {
  return (
    <div className="flex flex-col flex-1 w-full">
      <div className="flex flex-col gap-4 my-auto w-full">
        <h1 className="font-bold text-black mb-2">
          Réinitialisation du mot de passe
        </h1>

        <p className="text-sm text-gray-600 mb-4">
          Veuillez saisir votre nouveau mot de passe ci-dessous.
        </p>

        <PasswordUpdateHome message="Votre mot de passe a bien été réinitialisé, vous allez être redirigé automatiquement vers la page de connexion..." />
      </div>

      <div className="mt-auto flex justify-center w-full pt-6">
        <span className="text-sm text-gray-400">
          Sécurisation de votre compte
        </span>
      </div>
    </div>
  );
}
