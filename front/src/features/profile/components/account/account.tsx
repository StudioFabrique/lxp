import { FC, Ref, useContext } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ManagePassword from "./manage-password";
import { passwordSchema } from "../../schemas/password-schema";
import { profileApi } from "../../api/profile.api";
import PromoteToRoot from "./promote-to-root";
import { AuthContext } from "../../../../store/AuthProvider";

const Account: FC<{
  formRef: Ref<HTMLFormElement>;
}> = ({ formRef }) => {
  const { user } = useContext(AuthContext);
  const canBecomeRoot =
    user?.roles.some(({ role, rank }) => role === "admin" && rank === 1) ??
    false;
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
    profileApi.mutations
      .updatePassword({ oldPass: data.oldPass, newPass: data.newPass })
      .then(() =>
        toast.success("Informations du compte sauvegardé avec succès !"),
      )
      .catch((err) => {
        const errorMessage = err?.response?.data?.message ?? "Erreur inconnue";
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
        <ManagePassword formProps={{ register, errors }} />
      </form>
      {canBecomeRoot ? <PromoteToRoot /> : null}
    </>
  );
};

export default Account;
