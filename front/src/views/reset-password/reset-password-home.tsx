/**
 *   Cette vue est la première étape pour réinitialiser le mot de passe
 *   d'un utilisateur. Elle permet de vérifier que l'email de l'utilisateur
 *   existe avant de lui envoyer un courriel contenant un lien de
 *   pour réinitialiser le mot de passe.
 */

import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import image from "../../assets/images/andria-2.png";
import Field from "../../components/UI/forms/field";
import SubmitButton from "../../components/UI/submit-button";
import Wrapper from "../../components/UI/wrapper/wrapper.component";
import { Context } from "../../store/context.store";
import useResetPasswordHome from "./use-password-home";

export default function ResetPasswordHome() {
  const { initTheme } = useContext(Context);
  const { data, emailVerified, error, handleCheckEmail, isLoading } =
    useResetPasswordHome();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  // Composant affiché qd l'existence de l'adresse email dans le système est confirmée
  const emailIsValid = (
    <section className="w-2/6">
      <Wrapper>
        <div className="flex flex-col gap-y-4 items-center">
          <h2>
            Un email de réinitialisation du mot de passe a été envoyé. Veuillez
            consulter vos emails afin de poursuivre la réinitialisation de votre
            mot de passe.
          </h2>
          <Link className="w-fit btn btn-primary" to="/">
            Retour à l'accueil
          </Link>
        </div>
      </Wrapper>
    </section>
  );

  // Composant permettant de saisir l'adresse email à vérifier
  const emailIsNotValid = (
    <section className="w-96">
      <Wrapper>
        <form className="flex flex-col gap-y-4" onSubmit={handleCheckEmail}>
          <Field
            label="Entrez l'adresse email associée à votre compte"
            placeholder="jean.dupont@exemple.fr"
            data={data}
            name="email"
          />
          {error.length > 0 ? (
            <p className="text-xs text-error">{error}</p>
          ) : (
            <p> </p>
          )}
          <div className="text-right">
            <SubmitButton
              label="Envoyer"
              loadingLabel="En cours..."
              isLoading={isLoading}
            />
          </div>
        </form>
      </Wrapper>
    </section>
  );

  return (
    <main className="min-w-screen min-h-screen flex flex-col place-items-center gap-y-8 p-2">
      <img className="w-96 h-auto" src={image} alt="logo de l'application" />
      <h1 className="text-xl font-bold">Réinitialisation du mot de passe</h1>
      {!emailVerified ? emailIsNotValid : emailIsValid}
    </main>
  );
}
