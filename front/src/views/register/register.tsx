/**
 *   Cette vue permet à un utilisateur de saisir un mot de passe pour son compte
 *   nouvellement créé.
 *   Accessible depuis un lien envoyé dans un courriel de vérification.
 */

import { useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import image from "../../assets/images/andria-2.png";
import PasswordUpdateForm from "../../components/password-update/password-update-form";
import PasswordUpdateSuccess from "../../components/password-update/password-update-success";

import PasswordUpdateError from "../../components/password-update/password-update-error";
import useAccountActivation from "../../hooks/use-password-update";
import { Context } from "../../store/context.store";

export default function RegisterHome() {
  const { chooseTheme } = useContext(Context);
  const [searchParams] = useSearchParams();
  //  custom hook qui gère la logique du composant
  const {
    checkToken,
    error,
    handleChange,
    handleSubmit,
    isValid,
    password,
    password2,
    success,
    submitLoader,
  } = useAccountActivation(searchParams.get("id") ?? "");

  //  Choisit un thème clair par défaut et vérifie la validité du lien d'activation
  useEffect(() => {
    chooseTheme("winter", "light");
    checkToken();
  }, [checkToken, chooseTheme, searchParams]);

  return (
    <main className="flex flex-col gap-y-8 place-items-center p-2">
      {/* Header de la page */}
      <img className="w-96 h-auto" src={image} alt="logo de l'application" />
      <h1 className="text-3xl font-bold">Activation du compte</h1>
      {/* fin du header */}
      {error.length > 0 ? (
        // Message d'erreur en cas de lien non valide
        <section className="flex flex-col gap-y-8 justify-center items-center">
          <PasswordUpdateError error={error} url="/" />
        </section>
      ) : (
        <>
          {success ? (
            // Message si l'activation du compte est réussie
            <section className="flex flex-col place-items-center">
              <PasswordUpdateSuccess
                message="Votre compte a été activé, vous allez être redirigé automatiquement vers la page de connexion..."
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
        </>
      )}
    </main>
  );
}
