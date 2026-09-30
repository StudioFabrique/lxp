import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { recoverySchema } from "../auth.schema";
import { useFormField } from "../../../components/form/useFormField";
import { accountApi } from "../api/account.api";

export type AccountRecoveryMode = "reset" | "activation";

type UseResetPasswordOptions = {
  initialEmail?: string;
  initialMode?: AccountRecoveryMode;
  initialRetryAfterSeconds?: number;
};

type ApiError = {
  response?: {
    data?: {
      message?: string;
      retryAfterSeconds?: number;
    };
  };
};

export function useResetPassword({
  initialEmail = "",
  initialMode = "reset",
  initialRetryAfterSeconds = 0,
}: UseResetPasswordOptions = {}) {
  const form = useForm({
    resolver: zodResolver(recoverySchema),
    defaultValues: { email: initialEmail },
  });
  const [email, setEmail] = useFormField(form, "email");
  const [mode, setMode] = useState<AccountRecoveryMode>(initialMode);
  const [error, setError] = useState("");
  const fieldError = form.formState.errors.email?.message ?? "";
  const [isLoading, setIsLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [retryAfterSeconds, setRetryAfterSeconds] = useState(
    initialRetryAfterSeconds,
  );

  useEffect(() => {
    if (retryAfterSeconds <= 0) return;

    const timer = window.setTimeout(() => {
      setRetryAfterSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [retryAfterSeconds]);

  const changeMode = (nextMode: AccountRecoveryMode) => {
    setMode(nextMode);
    setError("");
    form.clearErrors("email");
    setRequestSent(false);
    setSuccessMessage("");
    setRetryAfterSeconds(0);
  };

  const handleCheckEmail = form.handleSubmit(
    async ({ email: normalizedEmail }) => {
      if (isLoading || retryAfterSeconds > 0) return;
      setError("");
      setIsLoading(true);
      try {
        const data =
          mode === "activation"
            ? await accountApi.resendActivation(normalizedEmail)
            : await accountApi.checkEmail(normalizedEmail);

        if (data.success) {
          setSuccessMessage(data.message);
          setRequestSent(true);
        }
      } catch (err: unknown) {
        const apiError = err as ApiError;
        setError(
          apiError.response?.data?.message ?? "Une erreur est survenue.",
        );
        setRetryAfterSeconds(apiError.response?.data?.retryAfterSeconds ?? 0);
      } finally {
        setIsLoading(false);
      }
    },
  );

  return {
    email,
    setEmail,
    mode,
    changeMode,
    fieldError,
    error,
    isLoading,
    requestSent,
    successMessage,
    retryAfterSeconds,
    handleCheckEmail,
  };
}
