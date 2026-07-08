import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import UserForm from "../components/user-form/UserForm";
import { userApi } from "../api/user.api";

const UserAdd = () => {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      userData,
      file,
    }: {
      userData: Record<string, unknown>;
      file: File | null;
    }) => userApi.mutations.create(userData, file),
    onSuccess: (data) => {
      toast.success(data.message ?? "Utilisateur créé avec succès");
      navigate("/admin/user");
    },
  });

  const handleSubmit = (
    userData: Record<string, unknown>,
    file: File | null,
  ) => {
    mutate({ userData, file });
  };

  return <UserForm onSubmitForm={handleSubmit} isLoading={isPending} />;
};

export default UserAdd;
