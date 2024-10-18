/**
 *   Cette vue permet à un utilisateur de saisir un mot de passe pour son compte
 *   nouvellement créé.
 *   Accessible depuis un lien envoyé dans un courriel de vérification.
 */

import { useContext, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import image from "../../assets/images/andria-2.png";
import FadeWrapper from "../../components/UI/fade-wrapper/fade-wrapper";
import FieldPassword from "../../components/UI/forms/field-password";
import SubmitButton from "../../components/UI/submit-button";
import useAccountActivation from "../../hooks/use-account-activation";
import { Context } from "../../store/context.store";

export default function RegisterHome() {
  const { chooseTheme } = useContext(Context);
  const [searchParams] = useSearchParams();
  //  custom hook qui gère la logique du composant
  const {
    checkToken,
    error,
    handleChangeP1,
    handleChangeP2,
    handleSubmit,
    isValid,
    password,
    password2,
    success,
    submitLoader,
  } = useAccountActivation(searchParams.get("id") ?? "");

  //  choisit un thème clair par défaut et vérifie la validité du lien d'activation
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
          <p className="border boder-error rounded-md shadow-md text-error p-4">
            {error}
          </p>
          <Link className="btn btn-ourlined btn-primary" to="/">
            Retour
          </Link>
        </section>
      ) : (
        <>
          {success ? (
            // Message si l'activation du compte est réussie
            <section className="flex flex-col place-items-center">
              <FadeWrapper>
                <p>
                  Votre compte a été activé, vous allez être redirigé
                  automatiquement vers la page de connexion...
                </p>
                <Link className="text-xs text-primary underline" to="/">
                  Cliquez sur ce lien si vous n'êtes pas redirigé...
                </Link>
              </FadeWrapper>
            </section>
          ) : (
            <>
              {/* Formulaire pour saisir le mot de passe et une confirmation */}
              <form
                className="flex flex-col items-start gap-y-4"
                onSubmit={handleSubmit}
              >
                <FieldPassword
                  label="Entrez votre mot de passe :"
                  value={password}
                  onSetValue={handleChangeP1}
                  match={password === password2}
                  isValid={isValid.p1}
                  name={password}
                />
                <FieldPassword
                  label="Confirmez votre mot de passe :"
                  value={password2}
                  onSetValue={handleChangeP2}
                  match={password === password2}
                  isValid={isValid.p2}
                  name={password2}
                />
                <div className="w-full flex justify-end">
                  <SubmitButton
                    isLoading={submitLoader}
                    label="Enregistrer"
                    loadingLabel="Enregistrement en cours..."
                  />
                </div>
              </form>
              {/* Fin du formulaire */}
              {/* Explication pour la saisie du mot de passe */}
              <section
                className={`w-72 text-xs justify-center p-4 border border-${isValid.p1 && isValid.p2 ? "primarty/20" : "error"} rounded-md ${isValid.p1 && isValid.p2 ? "" : "text-error"}`}
              >
                <p>Le mot de passe doit être composé d'au moins :</p>
                <ul className="pl-4 mt-2">
                  <li>- 12 caractères</li>
                  <li>- une majuscule</li>
                  <li>- une minuscule</li>
                  <li>- un nombre</li>
                  <li>- un caractère spécial</li>
                </ul>
              </section>
            </>
          )}
        </>
      )}
    </main>
  );
}
