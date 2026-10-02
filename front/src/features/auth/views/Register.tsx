import { zodResolver } from "@hookform/resolvers/zod";
import { passwordCreationSchema } from "../auth.schema";
/**
 *   Cette vue permet d'activer un compte utilisateur
 *   nouvellement créé.
 */

import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../../store/ThemeProvider";
import { Link, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { MailCheck } from "lucide-react";
import { accountApi } from "../api/account.api";
import PasswordUpdateError from "../components/PasswordUpdateError";
import PasswordForm from "../components/PasswordForm";
import AuthPageWrapper from "../components/AuthPageWrapper";
import OnboardingProgressPanel from "../../../components/UI/OnboardingProgressPanel";

type RegisterValues = {
  password: string;
  confirmPassword: string;
};

export default function RegisterHome() {
  const { chooseTheme } = useContext(ThemeContext);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("id") ?? "";

  const [error, setError] = useState("");
  const [expiredEmail, setExpiredEmail] = useState<string | null>(null);
  const [email, setEmail] = useState("");
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
    chooseTheme("classic", "light");
  }, [chooseTheme]);

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
        if (active) setEmail(result.email);
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

  return (
    <OnboardingProgressPanel
      contentKey={
        isChecking ? "checking" : error ? "error" : success ? "success" : "password"
      }
      currentStep={success ? 2 : 1}
      stepCount={2}
      progressLabel="Progression de l’activation du compte"
      animateProgressOnMount
      className="min-h-[500px] flex-none lg:min-h-0 lg:flex-1"
      footer={
        !isChecking && !error && (
          <div className="mt-5 border-t border-base-300 pt-4">
            {success ? (
              <Link
                className="btn btn-primary w-full rounded-lg text-base normal-case text-base-100"
                to="/login"
              >
                Retour à la page de connexion
              </Link>
            ) : (
              <button
                type="submit"
                form="account-activation-form"
                disabled={isLoading}
                className="btn btn-primary w-full"
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-sm" />
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
        description={email ? <strong>{email}</strong> : undefined}
        variant="setup"
      >
        {isChecking ? (
          <div
            role="status"
            aria-label="Vérification du lien"
            className="space-y-3"
          >
            <span className="sr-only">Vérification du lien…</span>
            <div className="skeleton h-8 w-2/3" />
            <div className="skeleton h-4 w-full" />
          </div>
        ) : error.length > 0 ? (
          <div className="flex flex-col gap-4">
            <PasswordUpdateError error={error} url="/login" />
            {expiredEmail !== null && (
              <Link
                className="btn btn-primary w-full"
                to="/reset-password"
                state={{ mode: "activation", email: expiredEmail }}
              >
                Renvoyer un lien d'activation
              </Link>
            )}
          </div>
        ) : success ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
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
