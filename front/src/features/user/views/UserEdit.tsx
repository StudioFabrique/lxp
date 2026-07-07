import { useParams, useNavigate } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { userMutations, userQueries } from "../user.api";
import UserForm from "../components/user-form/UserForm";

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading: isFetching } = useQuery({
    queryKey: ["user", id],
    queryFn: () => userQueries.getUserData(id!),
    enabled: !!id,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      userData,
      file,
    }: {
      userData: Record<string, unknown>;
      file: File | null;
    }) => userMutations.update(id!, userData, file),
    onSuccess: (res) => {
      toast.success(res.message ?? "Utilisateur mis à jour avec succès");
      navigate("/admin/user");
    },
  });

  const handleSubmit = (userData: Record<string, unknown>, file: File | null) => {
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
