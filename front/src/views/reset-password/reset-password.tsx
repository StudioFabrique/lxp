/* eslint-disable @typescript-eslint/no-explicit-any */

import { useContext, useEffect } from "react";
import { Context } from "../../store/context.store";
import Field from "../../components/UI/forms/field";
import useForm from "../../components/UI/forms/hooks/use-form";
import Wrapper from "../../components/UI/wrapper/wrapper.component";
import SubmitButton from "../../components/UI/submit-button";
import useHttp from "../../hooks/use-http";
import { z, ZodError } from "zod";
import { validationErrors } from "../../helpers/validate";

export default function ResetPassword() {
  const { initTheme } = useContext(Context);
  const { errors, values, onChangeValue, onValidationErrors, onResetForm } =
    useForm();
  const { error, isLoading, sendRequest } = useHttp();

  const data = { values, errors, onChangeValue };

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
  };

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <main className="min-w-screen min-h-screen flex flex-col gap-y-8 p-2">
      <h1 className="text-xl font-bold">Réinitialisation du mot de passe</h1>
      <section className="w-96">
        <Wrapper>
          <form className="flex flex-col gap-y-4" onSubmit={handleCheckEmail}>
            <Field
              label="Entrez l'adresse email associée à votre compte"
              placeholder="jean.dupont@exemple.fr"
              data={data}
              name="email"
            />
            <div className="text-right">
              <SubmitButton
                label="Envoyer"
                loadingLabel="En cours..."
                isLoading={isLoading}
              />
            </div>
          </form>
        </Wrapper>
      </section>
    </main>
  );
}
