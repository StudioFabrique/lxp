import { useForm } from "react-hook-form";
import { useState } from "react";
import { onboardingApi } from "../api/onboarding.api";
import PasswordForm from "./PasswordForm";
import { regexMail } from "../../../config/constantes";
import { getApiErrorMessage } from "../../../utils/helpers/api-error-message";

type Props = {
  token: string;
  onSuccess: () => void;
};

type AdminSignInValues = {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  confirmPassword: string;
};

const AdminSignInForm = ({ token, onSuccess }: Props) => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminSignInValues>({
    defaultValues: {
      email: "",
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
      await onboardingApi.createFirstAdmin({
        token,
        email: data.email.trim(),
        firstname: data.firstname.trim(),
        lastname: data.lastname.trim(),
        password: data.password,
      });
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

  return (
    <div className="flex flex-col gap-5 my-auto">
      <h1 className="font-bold text-xl text-base-content text-center">
        Créer votre administrateur
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        {/* Email */}
        <div className="form-control w-full">
          <input
            type="email"
            placeholder="Adresse email"
            {...register("email", {
              required: "L'adresse email est requise.",
              pattern: {
                value: regexMail,
                message: "L'adresse email n'est pas valide.",
              },
            })}
            className="input input-lg text-sm px-5 w-full bg-base-200 text-base-content placeholder-base-content/50 border-none focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
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
            "Créer l'administrateur"
          )}
        </button>
      </form>
    </div>
  );
};

export default AdminSignInForm;
