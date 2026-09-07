import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { onboardingApi } from "../api/onboarding.api";
import { getApiErrorMessage } from "../../../utils/helpers/api-error-message";
import AuthPageWrapper from "../components/AuthPageWrapper";

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
          <span className="loading loading-spinner loading-md mx-auto" />
        )}
        <p
          className={state === "error" ? "text-error" : "text-base-content/70"}
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
