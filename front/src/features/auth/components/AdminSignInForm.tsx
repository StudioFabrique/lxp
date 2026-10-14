import { zodResolver } from "@hookform/resolvers/zod";
import { adminCreationSchema } from "../auth.schema";
import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { createPortal } from "react-dom";
import { LoaderCircle, Mail, RotateCcw } from "lucide-react";
import { onboardingApi } from "../api/onboarding.api";
import PasswordForm from "./PasswordForm";
import { getApiErrorMessage } from "../../../utils/helpers/api-error-message";
import QuestionMarkTooltip from "../../../components/UI/question-mark-tooltip/question-mark-tooltip";
import AuthPageWrapper from "./AuthPageWrapper";
import { ROOT_ACCOUNT_POLICY } from "../root-account-policy";
import {
  clearPendingRootActivation,
  setPendingRootActivationEmail,
} from "../pending-root-activation";
import { ThemeContext } from "../../../store/ThemeProvider";
import { AuthHeaderActionContext } from "./AuthHeaderActionContext";

type Props = {
  token: string;
  onSuccess: () => void;
  onRestart?: () => void;
  initialActivationEmail?: string;
  email?: string;
  mode?: "first" | "additional";
};

type AdminSignInValues = {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  confirmPassword: string;
};

const AdminSignInForm = ({
  token,
  onSuccess,
  onRestart,
  initialActivationEmail = "",
  email = "",
  mode = "first",
}: Props) => {
  const { theme } = useContext(ThemeContext);
  const headerActionHost = useContext(AuthHeaderActionContext);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activationEmail, setActivationEmail] = useState(
    initialActivationEmail,
  );

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminSignInValues>({
    resolver: zodResolver(adminCreationSchema),
    defaultValues: {
      email,
      firstname: "",
      lastname: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: AdminSignInValues) => {
    setError("");
    setIsLoading(true);
    try {
      const createAccount =
        mode === "additional"
          ? onboardingApi.createRootAccount
          : onboardingApi.createFirstAdmin;
      const response = await createAccount({
        token,
        email: data.email.trim(),
        firstname: data.firstname.trim(),
        lastname: data.lastname.trim(),
        password: data.password,
        themeMode: theme,
      });

      if (mode === "first" && response.pendingActivation) {
        const pendingEmail = data.email.trim();
        setPendingRootActivationEmail(pendingEmail);
        setActivationEmail(pendingEmail);
        return;
      }

      onSuccess();
    } catch (err: unknown) {
      setError(
        getApiErrorMessage(err, "Une erreur est survenue. Veuillez réessayer."),
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (activationEmail) {
    const restartCreation = () => {
      clearPendingRootActivation();
      onRestart?.();
    };

    return (
      <>
        {headerActionHost &&
          createPortal(
            <button
              type="button"
              className="btn btn-circle btn-ghost tooltip tooltip-bottom text-base-content/70 transition-colors hover:text-base-content"
              data-tip="Recommencer la création"
              aria-label="Recommencer la création"
              onClick={restartCreation}
            >
              <RotateCcw className="size-5" aria-hidden="true" />
            </button>,
            headerActionHost,
          )}
        <AuthPageWrapper
          title="Vérifiez votre boîte mail"
          variant={mode === "first" ? "setup" : "default"}
          description={mode === "first" ? "Cliquez sur le lien compris dans le mail pour activer votre compte." : undefined}
        >
          <div className="flex min-h-64 flex-1 flex-col items-center justify-start gap-5 text-center">
            <Mail className="h-8 w-8" aria-hidden="true" />

            <div className="flex flex-col gap-10 text-sm text-base-content/70">
              <div className="flex flex-col">
                <span>Un lien d’activation a été envoyé à</span>
                <strong className="text-base-content">{activationEmail}</strong>
              </div>
              {mode !== "first" && <p>
                Cliquez sur ce lien compris dans le mail pour activer votre
                compte.
              </p>}
            </div>
          </div>
        </AuthPageWrapper>
      </>
    );
  }

  return (
    <AuthPageWrapper
      variant={mode === "first" ? "setup" : "default"}
      description={mode === "first" ? "Créez votre compte pour gérer l’identité, les paramètres et les accès à votre plateforme." : undefined}
      title={
        mode === "additional"
          ? "Créer votre compte root"
          : "Créer le compte super administrateur"
      }
      titleAccessory={
        <QuestionMarkTooltip tooltipValue={ROOT_ACCOUNT_POLICY} />
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-1 flex-col gap-3"
      >
        {/* Email */}
        <div className="form-control w-full">
          <input
            type="email"
            placeholder="Adresse email"
            readOnly={email.length > 0}
            {...register("email")}
            className="input input-lg text-sm px-5 w-full bg-base-200 text-base-content placeholder-base-content/50 border-none focus:outline-none focus:ring-2 focus:ring-primary rounded-lg read-only:cursor-not-allowed read-only:text-base-content/60"
          />
          {errors.email && (
            <span className="text-xs text-error mt-1">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Prénom */}
        <div className="form-control w-full">
          <input
            type="text"
            placeholder="Prénom"
            {...register("firstname")}
            className="input input-lg text-sm px-5 w-full bg-base-200 text-base-content placeholder-base-content/50 border-none focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
          />
          {errors.firstname && (
            <span className="text-xs text-error mt-1">
              {errors.firstname.message}
            </span>
          )}
        </div>

        {/* Nom */}
        <div className="form-control w-full">
          <input
            type="text"
            placeholder="Nom"
            {...register("lastname")}
            className="input input-lg text-sm px-5 w-full bg-base-200 text-base-content placeholder-base-content/50 border-none focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
          />
          {errors.lastname && (
            <span className="text-xs text-error mt-1">
              {errors.lastname.message}
            </span>
          )}
        </div>

        <PasswordForm register={register} watch={watch} errors={errors} />

        {error && (
          <span className="text-sm text-error text-center">{error}</span>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary mt-auto w-full rounded-lg text-base normal-case text-base-100"
        >
          {isLoading ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              Création...
            </>
          ) : mode === "additional" ? (
            "Créer le compte root"
          ) : (
            "Créer le compte root"
          )}
        </button>
      </form>
    </AuthPageWrapper>
  );
};

export default AdminSignInForm;
