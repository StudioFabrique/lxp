import { Link, useLocation } from "react-router";
import {
  type AccountRecoveryMode,
  useResetPassword,
} from "../hooks/useResetPassword";
import ResetPasswordFormEmail from "../components/ResetPasswordFormEmail";
import AuthPageWrapper from "../components/AuthPageWrapper";

type RecoveryNavigationState = {
  email?: string;
  mode?: AccountRecoveryMode;
  retryAfterSeconds?: number;
};

const ResetPasswordHome = () => {
  const location = useLocation();
  const navigationState = (location.state ?? {}) as RecoveryNavigationState;
  const {
    email,
    setEmail,
    mode,
    changeMode,
    fieldError,
    error,
    isLoading,
    requestSent,
    successMessage,
    retryAfterSeconds,
    handleCheckEmail,
  } = useResetPassword({
    initialEmail: navigationState.email,
    initialMode: navigationState.mode,
    initialRetryAfterSeconds: navigationState.retryAfterSeconds,
  });

  const isActivation = mode === "activation";

  if (requestSent) {
    return (
      <AuthPageWrapper
        title={
          isActivation
            ? "Lien d'activation envoyé"
            : "Lien de récupération envoyé"
        }
      >
        <div className="flex flex-col gap-6 text-center">
          <p className="text-sm text-base-content/70">{successMessage}</p>
          <p className="text-sm text-base-content/70">
            Consultez votre boîte de réception pour poursuivre la procédure.
          </p>
          <Link className="btn btn-outline btn-primary w-full" to="/login">
            Retour à la page de connexion
          </Link>
        </div>
      </AuthPageWrapper>
    );
  }

  return (
    <AuthPageWrapper
      title={
        isActivation
          ? "Activation du compte"
          : "Réinitialisation du mot de passe"
      }
      description={
        isActivation
          ? "Entrez l'adresse email associée à votre compte pour recevoir un nouveau lien d'activation."
          : "Entrez l'adresse email associée à votre compte pour recevoir un lien de récupération."
      }
    >
      <form className="flex w-full flex-col gap-4" onSubmit={handleCheckEmail}>
        <div className="form-control w-full">
          <ResetPasswordFormEmail
            email={email}
            onChange={setEmail}
            error={fieldError}
          />
        </div>

        {error && <span className="text-sm text-error -mt-2.5">{error}</span>}

        <button
          type="submit"
          disabled={isLoading || retryAfterSeconds > 0}
          className="btn btn-primary w-full text-base-100"
        >
          {isLoading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Envoi en cours...
            </>
          ) : retryAfterSeconds > 0 ? (
            `Nouvel envoi disponible dans ${retryAfterSeconds} s`
          ) : isActivation ? (
            "Renvoyer le lien d'activation"
          ) : (
            "Envoyer le lien"
          )}
        </button>

        <button
          type="button"
          onClick={() => changeMode(isActivation ? "reset" : "activation")}
          className="text-sm text-primary hover:underline transition-all"
        >
          {isActivation
            ? "Mot de passe oublié ?"
            : "Compte non activé ? Renvoyer le lien d'activation"}
        </button>

        <div className="text-center mt-2">
          <Link
            to="/login"
            className="text-sm text-base-content hover:underline transition-all"
          >
            Retour à la page de connexion
          </Link>
        </div>
      </form>
    </AuthPageWrapper>
  );
};

export default ResetPasswordHome;
