import { useForm } from "react-hook-form";
import { useState, useMemo } from "react";
import { Eye, EyeOff } from "lucide-react";
import { onboardingApi } from "../api/onboarding.api";

type Props = {
  token: string;
  onSuccess: () => void;
};

type FormData = {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  confirmPassword: string;
};

const passwordRules = [
  { test: (p: string) => p.length >= 12, label: "12 caractères minimum" },
  { test: (p: string) => /[A-Z]/.test(p), label: "une majuscule" },
  { test: (p: string) => /[a-z]/.test(p), label: "une minuscule" },
  { test: (p: string) => /[0-9]/.test(p), label: "un chiffre" },
  {
    test: (p: string) => /[-!@#$%^&*]/.test(p),
    label: "un caractère spécial",
  },
];

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  const score = passwordRules.filter((r) => r.test(password)).length;
  if (score <= 2) return { score, label: "Faible", color: "bg-error" };
  if (score <= 4) return { score, label: "Moyen", color: "bg-warning" };
  return { score, label: "Fort", color: "bg-success" };
}

const AdminSignInForm = ({ token, onSuccess }: Props) => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      firstname: "",
      lastname: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password");
  const strength = useMemo(
    () => getPasswordStrength(passwordValue ?? ""),
    [passwordValue],
  );

  const onSubmit = async (data: FormData) => {
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
    } catch (err: any) {
      const message =
        err.response?.data?.message ??
        "Une erreur est survenue. Veuillez réessayer.";
      setError(message);
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
                value:
                  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
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

        {/* Mot de passe */}
        <div className="form-control w-full">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              {...register("password", {
                required: "Le mot de passe est requis.",
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-!@#$%^&*])(?=.{12,})/,
                  message:
                    "Le mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
                },
              })}
              className="input input-lg text-sm px-5 w-full bg-base-200 text-base-content placeholder-base-content/50 border-none focus:outline-none focus:ring-2 focus:ring-primary rounded-lg pr-12"
            />
            <button
              type="button"
              className="btn btn-sm btn-ghost absolute right-1 top-1/2 -translate-y-1/2"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <EyeOff width={20} height={20} />
              ) : (
                <Eye width={20} height={20} />
              )}
            </button>
          </div>
          {errors.password && (
            <span className="text-xs text-error mt-1">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Barre de force du mot de passe */}
        {passwordValue && passwordValue.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 transition-colors ${
                    i < strength.score ? strength.color : "bg-base-300"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-base-content/60">
                Force : {strength.label}
              </span>
              <span className="text-xs text-base-content/40">
                {strength.score}/5 critères
              </span>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5">
              {passwordRules.map((rule) => (
                <span
                  key={rule.label}
                  className={`text-xs ${
                    rule.test(passwordValue)
                      ? "text-success"
                      : "text-base-content/40"
                  }`}
                >
                  {rule.test(passwordValue) ? "✓" : "○"} {rule.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Confirmation mot de passe */}
        <div className="form-control w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirmer le mot de passe"
            {...register("confirmPassword", {
              required: "La confirmation du mot de passe est requise.",
              validate: (value) =>
                value === passwordValue ||
                "Les mots de passe ne correspondent pas.",
            })}
            className="input input-lg text-sm px-5 w-full bg-base-200 text-base-content placeholder-base-content/50 border-none focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
          />
          {errors.confirmPassword && (
            <span className="text-xs text-error mt-1">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

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
