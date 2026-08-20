import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import UserForm from "../components/user-form/UserForm";
import { userApi } from "../api/user.api";
import {
  getApiErrorMessage,
  isConflictError,
} from "../../../utils/helpers/api-error-message";

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Un email déjà pris par un autre compte est refusé côté API : sans ce
  // relais, l'écran ne bougeait pas et la modification semblait ignorée.
  const [submitError, setSubmitError] = useState<{
    message: string;
    conflictingEmail: string | null;
  } | null>(null);

  const { data, isLoading: isFetching } = useQuery({
    queryKey: ["user", id],
    queryFn: () => userApi.queries.getUserData(id!),
    enabled: !!id,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      userData,
      file,
    }: {
      userData: Record<string, unknown>;
      file: File | null;
    }) => userApi.mutations.update(id!, userData, file),
    onSuccess: (res) => {
      toast.success(res.message ?? "Utilisateur mis à jour avec succès");
      navigate("/admin/user");
    },
    onError: (error, variables) => {
      // Sur ces deux routes, un 409 ne peut venir que de l'adresse email :
      // le message est donc aussi épinglé sous le champ, avec l'adresse
      // refusée pour que la correction fasse disparaître le repère.
      setSubmitError({
        message: getApiErrorMessage(error, "L'utilisateur n'a pas pu être modifié."),
        conflictingEmail: isConflictError(error)
          ? String(variables.userData.email ?? "")
          : null,
      });
    },
  });

  const handleSubmit = (
    userData: Record<string, unknown>,
    file: File | null,
  ) => {
    setSubmitError(null);
    mutate({ userData, file });
  };

  return (
    <UserForm
      user={data?.user ?? null}
      onSubmitForm={handleSubmit}
      error={submitError?.message}
      emailConflict={
        submitError?.conflictingEmail
          ? {
              email: submitError.conflictingEmail,
              message: submitError.message,
            }
          : undefined
      }
      isLoading={isPending}
      fieldsDisabled={isFetching}
      editMode
    />
  );
};

export default UserEdit;
