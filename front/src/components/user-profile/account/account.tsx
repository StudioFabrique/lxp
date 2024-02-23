import { FC, FormEvent, FormEventHandler, Ref, useRef } from "react";
import toast from "react-hot-toast";
import useForm from "../../UI/forms/hooks/use-form";
import { validationErrors } from "../../../helpers/validate";
import ManagePassword from "./manage-password";
import { passwordSchema } from "../../../lib/validation/profile/password-schema";
import useHttp from "../../../hooks/use-http";

const Account: FC<{
  formRef: Ref<HTMLFormElement>;
}> = ({ formRef }) => {
  const { sendRequest } = useHttp(true);
  const {
    onValidationErrors,
    ...formProps /* ...formProps prend le reste des valeurs de useForm non utilisées */
  } = useForm();

  const firstInputRef: Ref<HTMLInputElement> = useRef(null);

  const handleSubmitForm: FormEventHandler = (e: FormEvent) => {
    const applyData = () => {
      toast.success("Formulaire envoyé avec succès !");
    };

    e.preventDefault();

    try {
      passwordSchema.parse(formProps.values);
      if (formProps.values.newPass !== formProps.values.confirmNewPass) {
        toast.error("Les mot des passes ne correspondent pas");
        return;
      }
      sendRequest(
        {
          path: `/user/profile/password`,
          method: "put",
          body: {
            oldPass: formProps.values.oldPass,
            newPass: formProps.values.newPass,
          },
        },
        applyData
      );
    } catch (error) {
      const newErrors = validationErrors(error);
      toast.error(newErrors[0].message);
      onValidationErrors(newErrors);
    }
  };

  return (
    <>
      <form ref={formRef} onSubmit={handleSubmitForm}>
        <div className="grid grid-cols-2 gap-5">
          <ManagePassword formProps={formProps} firstInputRef={firstInputRef} />
        </div>
      </form>
    </>
  );
};

export default Account;
