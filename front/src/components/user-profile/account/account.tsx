import { FC, Ref } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ManagePassword from "./manage-password";
import { passwordSchema } from "../../../features/profile/schemas/password-schema";
import apiClient from "../../../lib/axios";

const Account: FC<{
  formRef: Ref<HTMLFormElement>;
}> = ({ formRef }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { oldPass: "", newPass: "", confirmNewPass: "" },
  });

  const onSubmit = (data: {
    oldPass: string;
    newPass: string;
    confirmNewPass: string;
  }) => {
    if (data.newPass !== data.confirmNewPass) {
      toast.error("Les mot des passes ne correspondent pas");
      return;
    }
    apiClient
      .put(`/user/profile/password`, {
        oldPass: data.oldPass,
        newPass: data.newPass,
      })
      .then(() =>
        toast.success("Informations du compte sauvegardé avec succès !"),
      )
      .catch((err) => {
        const errorMessage =
          err?.response?.data?.message ?? "Erreur inconnue";
        toast.error(errorMessage);
      });
  };

  return (
    <>
      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit, (errs) => {
          const firstError = Object.values(errs)[0];
          if (firstError?.message) toast.error(firstError.message);
        })}
      >
        <div className="grid grid-cols-2 gap-5">
          <ManagePassword formProps={{ register, errors }} />
        </div>
      </form>
    </>
  );
};

export default Account;
