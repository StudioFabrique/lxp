import { useState } from "react";
import { z } from "zod";
import { passwordApi } from "../api/password.api";

const emailSchema = z
  .string()
  .min(1, "L'adresse email est obligatoire")
  .email("Adresse email invalide.");

export function useResetPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const handleCheckEmail = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setFieldError("");

    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setFieldError(result.error.issues[0]?.message ?? "Adresse email invalide.");
      return;
    }

    setIsLoading(true);
    try {
      const data = await passwordApi.checkEmail(email);
      if (data.success) setEmailVerified(true);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Une erreur est survenue";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    fieldError,
    error,
    isLoading,
    emailVerified,
    handleCheckEmail,
  };
}
