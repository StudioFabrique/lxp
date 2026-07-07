import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { userMutations } from "../user.api";
import UserForm from "../components/user-form/UserForm";

const UserAdd = () => {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      userData,
      file,
    }: {
      userData: Record<string, unknown>;
      file: File | null;
    }) => userMutations.create(userData, file),
    onSuccess: (data) => {
      toast.success(data.message ?? "Utilisateur créé avec succès");
      navigate("/admin/user");
    },
  });

  const handleSubmit = (userData: Record<string, unknown>, file: File | null) => {
    mutate({ userData, file });
  };

  return <UserForm onSubmitForm={handleSubmit} isLoading={isPending} />;
};

export default UserAdd;
