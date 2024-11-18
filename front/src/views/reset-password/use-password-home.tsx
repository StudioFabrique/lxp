/**
 *   Ce composant contient la logique métier de la vue permettant
 *   de réinitialiser le mot de passe d'un utilisateur.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import useForm from "../../components/UI/forms/hooks/use-form";
import useHttp from "../../hooks/use-http";
import { z, ZodError } from "zod";
import { validationErrors } from "../../helpers/validate";

const useResetPasswordHome = () => {
  const { errors, values, onChangeValue, onValidationErrors } = useForm();
  const { error, isLoading, sendRequest } = useHttp();
  const [emailVerified, setEmailVerified] = useState(false);

  const data = { values, errors, onChangeValue };

  //  Soumet l'adresse saisie dans le formulaire à l'API après l'avoir vérifié
  const handleCheckEmail = (event: React.FormEvent) => {
    event.preventDefault();
    const schema = z.object({
      email: z
        .string({ required_error: "L'adresse email est obligatoire" })
        .email({ message: "Adresse email invalide." }),
    });
    try {
      schema.parse(values);
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errors = validationErrors(error);
        onValidationErrors(errors);
      }
    }
    const applyData = (data: { success: boolean; message: string }) => {
      if (data.success) setEmailVerified(true);
    };
    sendRequest(
      {
        path: "/user/check-email",
        method: "post",
        body: { email: values.email },
      },
      applyData,
    );
  };

  return { data, emailVerified, error, handleCheckEmail, isLoading };
};
export default useResetPasswordHome;
