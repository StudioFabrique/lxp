import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Mail, MailCheck } from "lucide-react";
import { onboardingApi } from "../api/onboarding.api";
import { getApiErrorMessage } from "../../../utils/helpers/api-error-message";
import AuthPageWrapper from "../components/AuthPageWrapper";
import AdminSetupLayout from "../components/AdminSetupLayout";
import { clearPendingRootActivation } from "../pending-root-activation";
import { cn } from "../../../utils/cn";

const ConfirmEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const [state, setState] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error",
  );
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
      <AuthPageWrapper title="Validation de l'adresse email" variant="setup">
        <div className="flex min-h-64 flex-1 flex-col items-center justify-center gap-5 text-center">
          {state === "success" ? (
            <MailCheck className="h-8 w-8" aria-hidden="true" />
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
          <p
            className={cn(
              "text-sm",
              state === "error" ? "text-error" : "text-base-content/70",
            )}
          >
            {message}
          </p>
          {state !== "loading" && (
            <Link
              className="btn btn-primary mt-auto w-full rounded-lg text-base normal-case text-base-100"
              to={state === "success" ? "/" : "/login"}
            >
              Continuer
            </Link>
          )}
        </div>
      </AuthPageWrapper>
    </AdminSetupLayout>
  );
};

export default ConfirmEmail;
