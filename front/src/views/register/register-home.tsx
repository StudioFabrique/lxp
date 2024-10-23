/**
 *   Cette vue permet d'activer un compte utilisateur
 *   nouvellement créé.
 */

import image from "../../assets/images/andria-2.png";
import PasswordUpdateHome from "../../components/password-update/password-update-home";

export default function RegisterHome() {
  return (
    <main className="flex flex-col gap-y-8 place-items-center p-2">
      {/* Header de la page */}
      <img className="w-96 h-auto" src={image} alt="logo de l'application" />
      <h1 className="text-3xl font-bold">Activation du compte</h1>
      {/* fin du header */}
      <PasswordUpdateHome />
    </main>
  );
}
