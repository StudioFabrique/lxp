/**
 *  Ce Composant permet à un utilisateur de mettre à jour son mot de passe
 *  dans le cas d'une activation de compte ou de réinitialisation du mot
 *  de passe.
 *  Accessible depuis un lien envoyé dans un courriel de vérification.
 */

import { useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PasswordUpdateForm from "../../components/password-update/password-update-form";
import PasswordUpdateSuccess from "../../components/password-update/password-update-success";

import PasswordUpdateError from "../../components/password-update/password-update-error";
import { Context } from "../../store/context.store";
import usePasswordUpdate from "../../hooks/use-password-update";

export default function PasswordUpdateHome() {
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
  } = usePasswordUpdate(searchParams.get("id") ?? "");

  //  Choisit un thème clair par défaut et vérifie la validité du lien d'activation
  useEffect(() => {
    chooseTheme("winter", "light");
  }, [chooseTheme]);

  useEffect(() => {
    checkToken();
  }, [checkToken]);

  return (
    <>
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
    </>
  );
}
