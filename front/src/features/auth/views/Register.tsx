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

type FormData = {
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
  } = useForm<FormData>({
    defaultValues: { password: "", confirmPassword: "" },
  });

  useEffect(() => {
    chooseTheme("classic", "light");
  }, [chooseTheme]);

  const onSubmit = async (data: FormData) => {
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
    <main className="flex flex-col gap-y-8 place-items-center p-2">
      <h1 className="text-3xl font-bold">Activation du compte</h1>

      {error.length > 0 ? (
        <section className="flex flex-col gap-y-8 justify-center items-center">
          <PasswordUpdateError error={error} url="/" />
        </section>
      ) : success ? (
        <section className="flex flex-col place-items-center">
          <PasswordUpdateSuccess
            message="Votre compte a été activé avec succès."
            url="/"
          />
        </section>
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
    </main>
  );
}
