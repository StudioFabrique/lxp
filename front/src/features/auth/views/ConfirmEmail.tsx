import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Mail, MailCheck } from "lucide-react";
import { onboardingApi } from "../api/onboarding.api";
import { getApiErrorMessage } from "../../../utils/helpers/api-error-message";
import AuthPageWrapper from "../components/AuthPageWrapper";
import AdminSetupLayout from "../components/AdminSetupLayout";
import ConfirmEmailErrorHelp from "../components/ConfirmEmailErrorHelp";
import AuthChatbotConfetti from "../components/AuthChatbotConfetti";
import { clearPendingRootActivation } from "../pending-root-activation";
import { cn } from "../../../utils/cn";

const successMessage =
  "Félicitations, votre compte est créé ! Votre adresse email est validée : vous pouvez maintenant vous connecter.";

const ConfirmEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const [state, setState] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error",
  );
  const [activatedEmail, setActivatedEmail] = useState("");
  const [message, setMessage] = useState(
    token ? "Validation en cours…" : "Le lien de validation est incomplet.",
  );

  useEffect(() => {
    if (!token) return;

    let active = true;
    onboardingApi
      .confirmEmail(token)
      .then((response) => {
        if (!active) return;
        clearPendingRootActivation();
        setActivatedEmail(response.email);
        setState("success");
        setMessage(response.message);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setState("error");
        setMessage(
          getApiErrorMessage(error, "L'adresse email n'a pas pu être validée."),
        );
      });

    return () => {
      active = false;
    };
  }, [token]);

  return (
    <AdminSetupLayout
      currentStep={state === "success" ? 2 : 1}
      contentKey={state}
    >
      <AuthPageWrapper
        title="Validation de l'adresse email"
        variant="setup"
        description={
          state === "success" ? (
            successMessage
          ) : state === "error" ? (
            <ConfirmEmailErrorHelp message={message} />
          ) : undefined
        }
      >
        {state === "success" && <AuthChatbotConfetti />}
        <div className="flex min-h-64 flex-1 flex-col items-center justify-center gap-5 text-center">
          {state === "success" ? (
            <div className="flex flex-col items-center gap-3 text-success">
              <MailCheck className="h-8 w-8" aria-hidden="true" />
              <span>Adresse mail validée</span>
            </div>
          ) : (
            <Mail className="h-8 w-8" aria-hidden="true" />
          )}
          {state === "loading" && (
            <div
              role="status"
              aria-label="Validation de l'adresse email"
              className="w-full space-y-3"
            >
              <span className="sr-only">Validation de l'adresse email…</span>
              <div className="skeleton mx-auto h-5 w-2/3" />
              <div className="skeleton mx-auto h-4 w-1/2" />
            </div>
          )}
          {state !== "success" && (
            <p
              className={cn(
                "text-sm",
                state === "error" ? "text-error" : "text-base-content/70",
              )}
            >
              {message}
            </p>
          )}
          {state !== "loading" && (
            <Link
              className="btn btn-primary mt-auto w-full rounded-lg text-base normal-case text-base-100"
              to="/login"
              state={state === "success" ? { activatedEmail } : undefined}
            >
              {state === "success" ? "Continuer" : "Aller à la connexion"}
            </Link>
          )}
        </div>
      </AuthPageWrapper>
    </AdminSetupLayout>
  );
};

export default ConfirmEmail;
