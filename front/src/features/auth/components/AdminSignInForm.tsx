import { useForm } from "react-hook-form";
import { useState } from "react";
import { MailCheck } from "lucide-react";
import { onboardingApi } from "../api/onboarding.api";
import PasswordForm from "./PasswordForm";
import { regexMail } from "../../../config/constantes";
import { getApiErrorMessage } from "../../../utils/helpers/api-error-message";
import QuestionMarkTooltip from "../../../components/UI/question-mark-tooltip/question-mark-tooltip";
import AuthPageWrapper from "./AuthPageWrapper";
import { ROOT_ACCOUNT_POLICY } from "../root-account-policy";
import {
  clearPendingRootActivation,
  setPendingRootActivationEmail,
} from "../pending-root-activation";

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
      <AuthPageWrapper title="Vérifiez votre boîte mail">
        <div className="flex min-h-64 flex-col items-center justify-center gap-5 text-center">
          <MailCheck className="h-8 w-8" aria-hidden="true" />

          <div className="flex flex-col gap-2 text-sm text-base-content/70">
            <div className="flex flex-col">
              <span>Un lien d’activation a été envoyé à</span>
              <strong className="text-base-content">{activationEmail}</strong>
            </div>
            <p>
              Cliquez sur ce lien pour activer votre compte, puis connectez-vous
              à votre espace.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-sm w-full normal-case text-base-content/70"
            onClick={restartCreation}
          >
            Recommencer la création
          </button>
        </div>
      </AuthPageWrapper>
    );
  }

  return (
    <AuthPageWrapper
      title={
        mode === "additional"
          ? "Créer votre compte root"
          : "Créer votre administrateur"
      }
      titleAccessory={
        <QuestionMarkTooltip tooltipValue={ROOT_ACCOUNT_POLICY} />
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        {/* Email */}
        <div className="form-control w-full">
          <input
            type="email"
            placeholder="Adresse email"
            readOnly={email.length > 0}
            {...register("email", {
              required: "L'adresse email est requise.",
              pattern: {
                value: regexMail,
                message: "L'adresse email n'est pas valide.",
              },
            })}
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
            {...register("firstname", {
              required: "Le prénom est requis.",
            })}
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
            {...register("lastname", {
              required: "Le nom est requis.",
            })}
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
          className="btn btn-primary w-full text-base-100 rounded-lg normal-case text-base mt-1"
        >
          {isLoading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Création...
            </>
          ) : mode === "additional" ? (
            "Créer le compte root"
          ) : (
            "Créer l'administrateur"
          )}
        </button>
      </form>
    </AuthPageWrapper>
  );
};

export default AdminSignInForm;
