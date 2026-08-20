import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  type UseFormRegister,
  type UseFormWatch,
  type FieldErrors,
  type FieldValues,
  type Path,
} from "react-hook-form";

/**
 * Générique sur le type du formulaire appelant : `UseFormRegister<T>` est
 * contravariant, un formulaire typé ne pouvait donc pas être passé à un
 * composant qui attendait `FieldValues`.
 */
type Props<T extends FieldValues> = {
  register: UseFormRegister<T>;
  watch: UseFormWatch<T>;
  errors: FieldErrors<T>;
  passwordFieldName?: Path<T>;
  confirmPasswordFieldName?: Path<T>;
};

const passwordRules = [
  { test: (p: string) => p.length >= 12, label: "12 caractères minimum" },
  { test: (p: string) => /[A-Z]/.test(p), label: "une majuscule" },
  { test: (p: string) => /[a-z]/.test(p), label: "une minuscule" },
  { test: (p: string) => /[0-9]/.test(p), label: "un chiffre" },
  { test: (p: string) => /[-!@#$%^&*]/.test(p), label: "un caractère spécial" },
];

function getPasswordStrength(password: string) {
  const score = passwordRules.filter((r) => r.test(password)).length;
  if (score <= 2) return { score, label: "Faible", color: "bg-error" };
  if (score <= 4) return { score, label: "Moyen", color: "bg-warning" };
  return { score, label: "Fort", color: "bg-success" };
}

const PasswordForm = <T extends FieldValues>({
  register,
  watch,
  errors,
  passwordFieldName = "password" as Path<T>,
  confirmPasswordFieldName = "confirmPassword" as Path<T>,
}: Props<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  const passwordValue = watch(passwordFieldName) ?? "";
  const strength = getPasswordStrength(passwordValue);

  const errorPassword = errors[passwordFieldName];
  const errorConfirm = errors[confirmPasswordFieldName];

  return (
    <div className="flex flex-col gap-3">
      {/* Mot de passe */}
      <div className="form-control w-full">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mot de passe"
            {...register(passwordFieldName, {
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
        {errorPassword && (
          <span className="text-xs text-error mt-1">
            {errorPassword.message?.toString()}
          </span>
        )}
      </div>

      {/* Barre de force du mot de passe */}
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

      {/* Confirmation mot de passe */}
      <div className="form-control w-full">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirmer le mot de passe"
          {...register(confirmPasswordFieldName, {
            required: "La confirmation du mot de passe est requise.",
            validate: (value, formValues) =>
              value === formValues[passwordFieldName] ||
              "Les mots de passe ne correspondent pas.",
          })}
          className="input input-lg text-sm px-5 w-full bg-base-200 text-base-content placeholder-base-content/50 border-none focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
        />
        {errorConfirm && (
          <span className="text-xs text-error mt-1">
            {errorConfirm.message?.toString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default PasswordForm;
