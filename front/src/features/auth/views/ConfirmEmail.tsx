import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { onboardingApi } from "../api/onboarding.api";
import { getApiErrorMessage } from "../../../utils/helpers/api-error-message";
import AuthPageWrapper from "../components/AuthPageWrapper";
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
    <AuthPageWrapper title="Validation de l'adresse email">
      <div className="flex min-h-40 flex-col justify-center gap-4 text-center">
        {state === "loading" && (
          <div role="status" aria-label="Validation de l'adresse email" className="space-y-3">
            <span className="sr-only">Validation de l'adresse email…</span>
            <div className="skeleton mx-auto h-5 w-2/3" />
            <div className="skeleton mx-auto h-4 w-1/2" />
          </div>
        )}
        <p
          className={cn(state === "error" ? "text-error" : "text-base-content/70")}
        >
          {message}
        </p>
      </div>
      {state !== "loading" && (
        <Link
          className="btn btn-primary"
          to={state === "success" ? "/" : "/login"}
        >
          Continuer
        </Link>
      )}
    </AuthPageWrapper>
  );
};

export default ConfirmEmail;
