import { LoaderCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../auth.schema";
import { showFormErrors } from "../../../components/form/form-errors";
import { Link, useLocation } from "react-router";
import { AuthContext } from "../../../store/AuthProvider";
import PasswordVisibilityToggle from "../components/PasswordVisibilityToggle";
import AuthPageWrapper from "../components/AuthPageWrapper";
import AuthOnboardingChatbot from "../components/AuthOnboardingChatbot";

const activatedMessage =
  "Votre compte est activé ! Votre adresse mail est déjà renseignée : saisissez le mot de passe que vous venez de créer, puis cliquez sur « Se connecter ».";

/** E-mail transmis par l'activation du compte ; toute autre valeur de navigation est ignorée. */
const readActivatedEmail = (state: unknown): string => {
  if (typeof state !== "object" || state === null || !("activatedEmail" in state)) return "";
  return typeof state.activatedEmail === "string" ? state.activatedEmail.trim() : "";
};

const Login = () => {
  const {
    isLoading,
    error,
    login,
    activationRequired,
    activationRetryAfterSeconds,
  } = useContext(AuthContext);
  const activatedEmail = readActivatedEmail(useLocation().state);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const [inputType, setInputType] = useState("password");
  const { register, handleSubmit, setFocus } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: activatedEmail, password: "" },
  });
  useEffect(() => {
    if (activatedEmail) setFocus("password");
  }, [activatedEmail, setFocus]);
  const submitHandler = handleSubmit((values) => {
    setSubmittedEmail(values.email);
    login(values.email, values.password);
  }, showFormErrors);

  const handlePasswordVisibility = () => {
    setInputType((prev) => (prev === "password" ? "text" : "password"));
  };

  return (
    <AuthPageWrapper title="Connectez-vous à votre espace">
      {activatedEmail && (
        <AuthOnboardingChatbot introduction={false} compact message={activatedMessage} />
      )}
      <form className="flex flex-col gap-4" onSubmit={submitHandler}>
        {/* Champ email */}
        <div className="form-control w-full">
          <input
            type="email"
            autoComplete="email"
            {...register("email")}
            placeholder="Adresse mail"
            className="input input-lg text-sm px-5 w-full bg-base-200 text-base-content placeholder-base-content/50 border-none focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
          />
        </div>

        {/* Champ mot de passe */}
        <div className="form-control w-full relative">
          <input
            type={inputType}
            autoComplete="current-password"
            {...register("password")}
            placeholder="Mot de passe"
            className="input input-lg text-sm px-5 w-full bg-base-200 text-base-content placeholder-base-content/50 border-none focus:outline-none focus:ring-2 focus:ring-primary rounded-lg pr-12"
          />
          <div className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer flex items-center">
            <PasswordVisibilityToggle
              inputType={inputType}
              onPasswordVisibility={handlePasswordVisibility}
            />
          </div>
        </div>

        {/* Message d'erreur */}
        {error && <span className="text-sm text-error -mt-2.5">{error}</span>}

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full text-base-100 rounded-lg mt-2 normal-case text-base"
        >
          {isLoading ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              Connexion...
            </>
          ) : (
            "Se connecter"
          )}
        </button>

        {activationRequired && (
          <Link
            to="/reset-password"
            state={{
              mode: "activation",
              email: submittedEmail,
              retryAfterSeconds: activationRetryAfterSeconds,
            }}
            className="btn btn-sm btn-outline w-full"
          >
            Compte non activé ?
          </Link>
        )}

        <div className="text-center mt-2">
          <Link
            to="/reset-password"
            className="text-sm text-base-content hover:underline transition-all"
          >
            Mot de passe oublié ?
          </Link>
        </div>
      </form>
    </AuthPageWrapper>
  );
};

export default Login;
