/**
 *   Cette vue permet d'activer un compte utilisateur
 *   nouvellement créé.
 */

import { useContext, useEffect } from "react";
import { ThemeContext } from "../../../store/ThemeProvider";
import { useSearchParams } from "react-router";
import usePasswordUpdate from "../../../../old.src-arch/hooks/use-password-update";
import PasswordUpdateError from "../../../../old.src-arch/components/password-update/password-update-error";
import PasswordUpdateSuccess from "../../../../old.src-arch/components/password-update/password-update-success";
import PasswordUpdateForm from "../../../../old.src-arch/components/password-update/password-update-form";

export default function RegisterHome() {
  const { chooseTheme } = useContext(ThemeContext);
  const [searchParams] = useSearchParams();
  //  custom hook qui gère la logique du composant
  const {
    checkToken,
    error,
    handleChange,
    handleSubmit,
    isValid,
    success,
    password,
    password2,
    submitLoader,
  } = usePasswordUpdate(searchParams.get("id") ?? "");

  //  Choisit un thème clair par défaut et vérifie la validité du lien d'activation
  useEffect(() => {
    chooseTheme("classic", "light");
  }, [chooseTheme]);

  useEffect(() => {
    checkToken();
  }, [checkToken]);

  return (
    <main className="flex flex-col gap-y-8 place-items-center p-2">
      {/* Header de la page */}
      <h1 className="text-3xl font-bold">Activation du compte</h1>
      {/* fin du header */}
      {error.length > 0 ? (
        // Message d'erreur en cas de lien non valide
        <section className="flex flex-col gap-y-8 justify-center items-center">
          <PasswordUpdateError error={error} url="/" />
        </section>
      ) : success ? (
        // Message si l'activation du compte est réussie
        <section className="flex flex-col place-items-center">
          <PasswordUpdateSuccess
            message={
              "Votre compte a été activé, vous allez être redirigé automatiquement vers la page de connexion..."
            }
            url="/"
          />
        </section>
      ) : (
        <section>
          {/* Formulaire pour saisir le mot de passe et une confirmation */}
          <PasswordUpdateForm
            onHandleChange={handleChange}
            password={password}
            password2={password2}
            onHandleSubmit={handleSubmit}
            isValid={isValid}
            submitLoader={submitLoader}
          />
        </section>
      )}
    </main>
  );
}
