import { useParams, useNavigate } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import UserForm from "../components/user-form/UserForm";
import { userApi } from "../api/user.api";

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
  });

  const handleSubmit = (
    userData: Record<string, unknown>,
    file: File | null,
  ) => {
    mutate({ userData, file });
  };

  return (
    <UserForm
      user={data?.user ?? null}
      onSubmitForm={handleSubmit}
      isLoading={isPending}
      fieldsDisabled={isFetching}
      editMode
    />
  );
};

export default UserEdit;
