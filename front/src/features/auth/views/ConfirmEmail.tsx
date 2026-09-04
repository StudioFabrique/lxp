import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { onboardingApi } from "../api/onboarding.api";
import { getApiErrorMessage } from "../../../utils/helpers/api-error-message";

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
    <div className="my-auto flex flex-col gap-4 text-center">
      <h1 className="text-xl font-bold text-base-content">
        Validation de l'adresse email
      </h1>
      {state === "loading" && (
        <span className="loading loading-spinner loading-md mx-auto" />
      )}
      <p className={state === "error" ? "text-error" : "text-base-content/70"}>
        {message}
      </p>
      {state !== "loading" && (
        <Link className="btn btn-primary" to={state === "success" ? "/" : "/login"}>
          Continuer
        </Link>
      )}
    </div>
  );
};

export default ConfirmEmail;
