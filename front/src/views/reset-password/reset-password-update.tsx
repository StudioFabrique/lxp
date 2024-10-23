/**
 *   Cette vue permet de réinitialiser le mot de passe du
 *   compte d'un utilisateur.
 */

import image from "../../assets/images/andria-2.png";
import PasswordUpdateHome from "../../components/password-update/password-update-home";

export default function ResetPasswordUpdate() {
  return (
    <main className="flex flex-col gap-y-8 place-items-center p-2">
      {/* Header de la page */}
      <img className="w-96 h-auto" src={image} alt="logo de l'application" />
      <h1 className="text-3xl font-bold">Réinitialisation du mot de passe</h1>
      {/* fin du header */}
      <PasswordUpdateHome message="Votre mot de passe a bien été réinitialisé, vous allez être redirigé automatiquement vers la page de connexion..." />
    </main>
  );
}
