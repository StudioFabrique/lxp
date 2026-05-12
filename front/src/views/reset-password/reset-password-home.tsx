import { useContext, useEffect } from "react";
import { Link } from "react-router";
import Field from "../../components/UI/forms/field";
import useResetPasswordHome from "./use-password-home";
import { Context } from "../../store/context.store";
import LoginLayout from "../../components/login-layout";

export default function ResetPasswordHome() {
  const { initTheme } = useContext(Context);
  const { data, emailVerified, error, handleCheckEmail, isLoading } =
    useResetPasswordHome();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  // Vue après envoi de l'email
  const emailIsValid = (
    <div className="flex flex-col gap-6 my-auto w-full text-center">
      <div className="bg-green-50 border border-green-100 p-6 rounded-xl">
        <h2 className="text-gray-800 leading-relaxed">
          Un email de réinitialisation a été envoyé. Veuillez consulter votre
          boîte de réception pour poursuivre la procédure.
        </h2>
      </div>
      <Link
        className="btn w-full bg-black hover:bg-gray-800 text-white border-none rounded-lg normal-case text-base"
        to="/"
      >
        Retour à la connexion
      </Link>
    </div>
  );

  // Vue formulaire de saisie
  const emailIsNotValid = (
    <form className="flex flex-col flex-1 w-full" onSubmit={handleCheckEmail}>
      <div className="flex flex-col gap-4 my-auto w-full">
        <h1 className="text-xl font-bold text-black mb-2">
          Réinitialisation du mot de passe
        </h1>

        <p className="text-sm text-gray-600 mb-2">
          Entrez l'adresse email associée à votre compte pour recevoir un lien
          de récupération.
        </p>

        <div className="form-control w-full">
          <Field
            placeholder="jean.dupont@exemple.fr"
            data={data}
            name="email"
          />
        </div>

        {error && (
          <span className="text-sm text-red-500 mt-[-10px]">{error}</span>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="btn w-full bg-black hover:bg-gray-800 text-white border-none rounded-lg mt-2 normal-case text-base disabled:bg-gray-400"
        >
          {isLoading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Envoi en cours...
            </>
          ) : (
            "Envoyer le lien"
          )}
        </button>

        <div className="text-center mt-2">
          <Link
            to="/"
            className="text-sm text-black hover:underline transition-all"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>

      <div className="mt-auto flex justify-center w-full pt-6">
        <button
          type="button"
          className="text-sm text-gray-700 hover:text-black transition-colors"
        >
          Besoin d'aide ?
        </button>
      </div>
    </form>
  );

  return (
    <LoginLayout>{!emailVerified ? emailIsNotValid : emailIsValid}</LoginLayout>
  );
}
