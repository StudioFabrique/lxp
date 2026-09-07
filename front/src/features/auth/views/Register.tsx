/**
 *   Cette vue permet d'activer un compte utilisateur
 *   nouvellement créé.
 */

import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../../store/ThemeProvider";
import { useSearchParams } from "react-router";
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
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const onSubmit = async (data: RegisterValues) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await accountApi.activateAccount(token, data.password);
      if (res.success) setSuccess(true);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Une erreur est survenue";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthPageWrapper title="Activation du compte">
      {error.length > 0 ? (
        <PasswordUpdateError error={error} url="/" />
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
              className="btn btn-primary w-full"
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
