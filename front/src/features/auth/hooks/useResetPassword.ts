import { useEffect, useState } from "react";
import { z } from "zod";
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

const emailSchema = z
  .string()
  .min(1, "L'adresse email est obligatoire")
  .email("Adresse email invalide.");

export function useResetPassword({
  initialEmail = "",
  initialMode = "reset",
  initialRetryAfterSeconds = 0,
}: UseResetPasswordOptions = {}) {
  const [email, setEmail] = useState(initialEmail);
  const [mode, setMode] = useState<AccountRecoveryMode>(initialMode);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");
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
    setFieldError("");
    setRequestSent(false);
    setSuccessMessage("");
    setRetryAfterSeconds(0);
  };

  const handleCheckEmail = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setFieldError("");

    const normalizedEmail = email.trim();
    const result = emailSchema.safeParse(normalizedEmail);
    if (!result.success) {
      setFieldError(
        result.error.issues[0]?.message ?? "Adresse email invalide.",
      );
      return;
    }

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
      setRetryAfterSeconds(
        apiError.response?.data?.retryAfterSeconds ?? 0,
      );
    } finally {
      setIsLoading(false);
    }
  };

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
