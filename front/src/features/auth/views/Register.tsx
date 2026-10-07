import { zodResolver } from "@hookform/resolvers/zod";
import { passwordCreationSchema } from "../auth.schema";
/**
 *   Cette vue permet d'activer un compte utilisateur
 *   nouvellement créé.
 */

import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { LoaderCircle, MailCheck } from "lucide-react";
import { accountApi } from "../api/account.api";
import PasswordForm from "../components/PasswordForm";
import AuthChatbotConfetti from "../components/AuthChatbotConfetti";
import AuthPageWrapper from "../components/AuthPageWrapper";
import OnboardingProgressPanel from "../../../components/UI/OnboardingProgressPanel";

type RegisterValues = {
  password: string;
  confirmPassword: string;
};

export default function RegisterHome() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("id") ?? "";

  const [error, setError] = useState("");
  const [expiredEmail, setExpiredEmail] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [roleLabel, setRoleLabel] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(passwordCreationSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  useEffect(() => {
    let active = true;
    if (!token) {
      setError("Ce lien n'est plus valide.");
      setIsChecking(false);
      return;
    }

    accountApi
      .checkInvitation(token)
      .then((result) => {
        if (active) {
          setEmail(result.email);
          setRoleLabel(result.roleLabel);
        }
      })
      .catch((err: unknown) => {
        if (!active) return;
        const response = (
          err as {
            response?: {
              data?: { code?: string; message?: string; email?: string };
            };
          }
        ).response;
        setError(response?.data?.message ?? "Ce lien n'est plus valide.");
        if (response?.data?.code === "ACTIVATION_LINK_EXPIRED") {
          setExpiredEmail(response.data.email ?? "");
        }
      })
      .finally(() => {
        if (active) setIsChecking(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  const onSubmit = async (data: RegisterValues) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await accountApi.activateAccount(token, data.password);
      if (res.success) setSuccess(true);
    } catch (err: unknown) {
      const response = (
        err as {
          response?: {
            data?: { code?: string; message?: string; email?: string };
          };
        }
      ).response;
      const msg = response?.data?.message ?? "Une erreur est survenue";
      setError(msg);
      if (response?.data?.code === "ACTIVATION_LINK_EXPIRED") {
        setExpiredEmail(response.data.email ?? "");
      }
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Une fois le compte activé, le lien est consommé : une revérification tardive ne doit plus afficher d'erreur.
  const showError = error.length > 0 && !success;

  return (
    <OnboardingProgressPanel
      contentKey={
        isChecking && !success
          ? "checking"
          : showError
            ? "error"
            : success
              ? "success"
              : "password"
      }
      currentStep={success ? 2 : 1}
      stepCount={2}
      progressLabel="Progression de l’activation du compte"
      animateProgressOnMount
      className="min-h-[500px] flex-none lg:min-h-0 lg:flex-1"
      footer={
        !(isChecking && !success) && (
          <div className="mt-5 flex flex-col gap-3 border-t border-base-300 pt-4">
            {success ? (
              <Link
                className="btn btn-primary w-full rounded-lg text-base normal-case text-base-100"
                to="/login"
              >
                Retour à la page de connexion
              </Link>
            ) : showError ? (
              <>
                {expiredEmail !== null && (
                  <Link
                    className="btn btn-primary w-full"
                    to="/reset-password"
                    state={{ mode: "activation", email: expiredEmail }}
                  >
                    Renvoyer un lien d'activation
                  </Link>
                )}
                <Link className="btn btn-outline btn-primary w-full" to="/login">
                  Retour
                </Link>
              </>
            ) : (
              <button
                type="submit"
                form="account-activation-form"
                disabled={isLoading}
                className="btn btn-primary w-full"
              >
                {isLoading ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  "Valider"
                )}
              </button>
            )}
          </div>
        )
      }
    >
      <AuthPageWrapper
        title={success ? "Compte activé" : "Activation du compte"}
        description={
          success ? (
            "Félicitations, votre compte est activé ! Vous pouvez maintenant vous connecter."
          ) : email ? (
            <>
              <p>
                Activez votre compte pour l'adresse mail{" "}
                <strong className="break-all">{email}</strong>
                {roleLabel && (
                  <>
                    {" "}en tant que{" "}
                    <span
                      className="badge badge-primary badge-soft badge-sm align-middle font-semibold"
                      aria-label={`Rôle : ${roleLabel}`}
                    >
                      {roleLabel}
                    </span>
                  </>
                )}
              </p>
              <p className="mt-2">
                Renseignez un mot de passe sécurisé.
              </p>
            </>
          ) : undefined
        }
        variant="setup"
      >
        {isChecking && !success ? (
          <div
            role="status"
            aria-label="Vérification du lien"
            className="space-y-3"
          >
            <span className="sr-only">Vérification du lien…</span>
            <div className="skeleton h-8 w-2/3" />
            <div className="skeleton h-4 w-full" />
          </div>
        ) : showError ? (
          <div role="alert" className="alert alert-error alert-soft">
            <span>{error}</span>
          </div>
        ) : success ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
            <AuthChatbotConfetti />
            <MailCheck className="h-8 w-8" aria-hidden="true" />
            <p className="text-sm text-base-content/70">
              Votre compte a été activé avec succès.
            </p>
          </div>
        ) : (
          <section>
            <form
              id="account-activation-form"
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-3"
            >
              <PasswordForm register={register} watch={watch} errors={errors} />
            </form>
          </section>
        )}
      </AuthPageWrapper>
    </OnboardingProgressPanel>
  );
}
