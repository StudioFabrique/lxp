import { useForm } from "react-hook-form";
import { useState } from "react";
import { onboardingApi } from "../api/onboarding.api";
import PasswordForm from "./PasswordForm";
import { regexMail } from "../../../config/constantes";
import { getApiErrorMessage } from "../../../utils/helpers/api-error-message";

type Props = {
  token: string;
  onSuccess: () => void;
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
  email = "",
  mode = "first",
}: Props) => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activationEmail, setActivationEmail] = useState("");

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
        setActivationEmail(data.email.trim());
        return;
      }

      onSuccess();
    } catch (err: unknown) {
      setError(
        getApiErrorMessage(
          err,
          "Une erreur est survenue. Veuillez réessayer.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (activationEmail) {
    return (
      <div className="my-auto flex flex-col gap-4 text-center">
        <h1 className="text-xl font-bold text-base-content">
          Activez votre compte root
        </h1>
        <p className="text-sm text-base-content/70">
          Un lien d'activation a été envoyé à {activationEmail}. Consultez
          votre boîte mail pour terminer la création du compte.
        </p>
        <p className="text-xs text-base-content/50">
          Le compte restera inaccessible tant que cette adresse n'aura pas été
          validée.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 my-auto">
      <h1 className="font-bold text-xl text-base-content text-center">
        {mode === "additional"
          ? "Créer votre compte root"
          : "Créer votre administrateur"}
      </h1>

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
          ) : (
            mode === "additional"
              ? "Créer le compte root"
              : "Créer l'administrateur"
          )}
        </button>
      </form>
    </div>
  );
};

export default AdminSignInForm;
