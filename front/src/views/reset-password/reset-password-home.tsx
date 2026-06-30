import { Link } from "react-router";
import Field from "../../components/UI/forms/field";
import useResetPasswordHome from "./use-password-home";
import LoginLayout from "../../components/login-layout";

export default function ResetPasswordHome() {
  const { data, emailVerified, error, handleCheckEmail, isLoading } =
    useResetPasswordHome();

  // Vue après envoi de l'email (Succès)
  const emailIsValid = (
    <div className="flex flex-col gap-6 my-auto w-full text-center">
      <div className="bg-success/10 border border-success/20 p-6 rounded-xl">
        <h2 className="text-success-content leading-relaxed text-sm">
          Un email de réinitialisation a été envoyé. Veuillez consulter votre
          boîte de réception pour poursuivre la procédure.
        </h2>
      </div>
      <Link className="btn btn-outline btn-primary w-full" to="/">
        Retour à la connexion
      </Link>
    </div>
  );

  // Vue formulaire de saisie
  const emailIsNotValid = (
    <form className="flex flex-col flex-1 w-full" onSubmit={handleCheckEmail}>
      <div className="flex flex-col gap-4 my-auto w-full">
        <h1 className="font-bold text-2xl text-base-content mb-2">
          Réinitialisation du mot de passe
        </h1>

        <p className="text-sm text-base-content/70 mb-2">
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

        {error && <span className="text-sm text-error -mt-2.5">{error}</span>}

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full text-base-100"
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
            className="text-sm text-base-content hover:underline transition-all"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    </form>
  );

  return (
    <LoginLayout>{!emailVerified ? emailIsNotValid : emailIsValid}</LoginLayout>
  );
}
