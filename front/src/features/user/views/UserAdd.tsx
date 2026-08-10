import { useNavigate, useSearchParams } from "react-router";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import UserForm from "../components/user-form/UserForm";
import { userApi } from "../api/user.api";
import {
  addStudentToGroupReturnPath,
  getSafeGroupReturnPath,
} from "../../group/helpers/group-form-draft";

const UserAdd = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const safeReturnTo = getSafeGroupReturnPath(returnTo);
  const initialRoleRank =
    safeReturnTo && searchParams.get("roleRank") === "3" ? 3 : undefined;

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
      const groupReturnPath = data.userId
        ? addStudentToGroupReturnPath(safeReturnTo, data.userId)
        : safeReturnTo;
      navigate(groupReturnPath ?? "/admin/user");
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
      onSubmitForm={handleSubmit}
      isLoading={isPending}
      initialRoleRank={initialRoleRank}
      cancelTo={safeReturnTo ?? undefined}
    />
  );
};

export default UserAdd;
