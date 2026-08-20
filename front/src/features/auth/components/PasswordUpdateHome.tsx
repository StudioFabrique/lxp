import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { ThemeContext } from "../../../../src/store/ThemeProvider";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { accountApi } from "../api/account.api";
import PasswordForm from "./PasswordForm";
import PasswordUpdateSuccess from "./PasswordUpdateSuccess";
import PasswordUpdateError from "./PasswordUpdateError";

type Props = {
  message: string;
  title?: string;
  description?: string;
};

type PasswordUpdateValues = {
  password: string;
  confirmPassword: string;
};

const PasswordUpdateHome = ({ message, title, description }: Props) => {
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
  } = useForm<PasswordUpdateValues>({
    defaultValues: { password: "", confirmPassword: "" },
  });

  useEffect(() => {
    chooseTheme("classic", "light");
  }, [chooseTheme]);

  const onSubmit = async (data: PasswordUpdateValues) => {
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

  return error.length > 0 ? (
    <section className="flex flex-col gap-y-8 justify-center items-center">
      <PasswordUpdateError error={error} url="/" />
    </section>
  ) : success ? (
    <section className="flex flex-col place-items-center">
      <PasswordUpdateSuccess message={message} url="/" />
    </section>
  ) : (
    <section>
      {title && <h1 className="font-bold text-base-content mb-2">{title}</h1>}
      {description && (
        <p className="text-sm text-base-content/60 mb-4">{description}</p>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <PasswordForm register={register} watch={watch} errors={errors} />
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full mt-2"
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Valider"
          )}
        </button>
      </form>
    </section>
  );
};

export default PasswordUpdateHome;
