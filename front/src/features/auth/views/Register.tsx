/**
 *   Cette vue permet d'activer un compte utilisateur
 *   nouvellement créé.
 */

import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../../store/ThemeProvider";
import { Link, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { accountApi } from "../api/account.api";
import PasswordUpdateError from "../components/PasswordUpdateError";
import PasswordUpdateSuccess from "../components/PasswordUpdateSuccess";
import PasswordForm from "../components/PasswordForm";
import AuthPageWrapper from "../components/AuthPageWrapper";

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
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
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

    accountApi.checkInvitation(token).catch((err: unknown) => {
      if (!active) return;
      const response = (err as {
        response?: { data?: { code?: string; message?: string; email?: string } };
      }).response;
      setError(response?.data?.message ?? "Ce lien n'est plus valide.");
      if (response?.data?.code === "ACTIVATION_LINK_EXPIRED") {
        setExpiredEmail(response.data.email ?? "");
      }
    }).finally(() => {
      if (active) setIsChecking(false);
    });

    return () => { active = false; };
  }, [token]);

  const onSubmit = async (data: RegisterValues) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await accountApi.activateAccount(token, data.password);
      if (res.success) setSuccess(true);
    } catch (err: unknown) {
      const response = (err as {
        response?: { data?: { code?: string; message?: string; email?: string } };
      }).response;
      const msg =
        response?.data?.message ?? "Une erreur est survenue";
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
    <AuthPageWrapper title="Activation du compte">
      {isChecking ? (
        <div role="status" aria-label="Vérification du lien" className="space-y-3">
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
        <PasswordUpdateSuccess
          message="Votre compte a été activé avec succès."
          url="/"
        />
      ) : (
        <section>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <PasswordForm register={register} watch={watch} errors={errors} />
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 btn btn-primary w-full"
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Valider"
              )}
            </button>
          </form>
        </section>
      )}
    </AuthPageWrapper>
  );
}
