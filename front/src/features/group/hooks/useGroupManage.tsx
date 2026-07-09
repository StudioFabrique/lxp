/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useParams, useSearchParams } from "react-router";
import { useCallback, useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import User from "../../../../src/utils/interfaces/user";
import { groupApi } from "../api/group.api";

function useGroupManage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usersToAdd, setUsersToAdd] = useState<Array<User>>([]);
  const [searchParams] = useSearchParams();
  const fromParcours = searchParams.get("parcours");

  const { data: existingGroup, isLoading } = useQuery({
    queryKey: ["group", id],
    queryFn: () => groupApi.queries.getById(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (existingGroup) {
      setUsersToAdd(existingGroup.users ?? []);
    }
  }, [existingGroup]);

  const handleNavigateAfterSubmit = useCallback(() => {
    if (fromParcours) {
      navigate(`/admin/parcours/edit/${fromParcours}?step=6`);
    } else {
      navigate("/admin/group", {
        state: {
          toastFrom: id
            ? "Groupe modifié avec succès"
            : "Groupe créé avec succès",
        },
      });
    }
  }, [fromParcours, navigate, id]);

  const mutation = useMutation({
    mutationFn: (formData: FormData) => {
      if (id) {
        return groupApi.mutations.update(id, formData);
      }
      return groupApi.mutations.create(formData);
    },
    onSuccess: handleNavigateAfterSubmit,
  });

  const handleSubmit = (data: any, file: File) => {
    const usersIdWithActiveState = usersToAdd.map((user) => ({
      _id: user._id,
      isActive: user.isActive,
    }));

    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({ ...data, users: usersIdWithActiveState }),
    );
    formData.append("image", file);

    mutation.mutate(formData);
  };

  const handleAddUsers = (users: Array<User>) => {
    setUsersToAdd((currentUsers) => [...currentUsers, ...users]);
  };

  const handleUpdateUser = (user: User) => {
    setUsersToAdd((usersToAdd) =>
      usersToAdd.map((userToAdd) =>
        userToAdd._id === user._id
          ? { ...userToAdd, isActive: user.isActive }
          : userToAdd,
      ),
    );
  };

  const handleDeleteUser = (user: User) => {
    setUsersToAdd((usersToAdd) =>
      usersToAdd.filter((userToAdd) => userToAdd._id !== user._id),
    );
  };

  return {
    existingGroup,
    usersToAdd,
    isLoading: isLoading || mutation.isPending,
    onSubmit: handleSubmit,
    onAddUsers: handleAddUsers,
    onUpdateUser: handleUpdateUser,
    onDeleteUser: handleDeleteUser,
  };
}

export default useGroupManage;
