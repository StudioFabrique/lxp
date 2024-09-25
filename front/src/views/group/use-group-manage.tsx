import { useNavigate, useParams } from "react-router-dom";
import useHttp from "../../hooks/use-http";
import { useCallback, useEffect, useState } from "react";
import User from "../../utils/interfaces/user";
import Group from "../../utils/interfaces/group";

function useGroupManage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoading, sendRequest } = useHttp(true);
  const [usersToAdd, setUsersToAdd] = useState<Array<User>>([]);
  const [submitMethod, setSubmitMethod] = useState<"put" | "post">("post");
  const [existingGroup, setExistingGroup] = useState<Group>();

  console.log({ usersToAdd });

  const handleSubmit = (data: any, file: File) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const applyData = (_data: any) => {
      navigate("/admin/group", {
        state: {
          toastFrom:
            submitMethod === "post"
              ? "Groupe modifié avec succès"
              : "Groupe créé avec succès",
        },
      });
    };

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

    sendRequest(
      {
        method: submitMethod,
        path: submitMethod === "post" ? "/group" : `/group/${id}`,
        body: formData,
      },
      applyData,
    );
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

  const getExistingGroup = useCallback(() => {
    const applyData = (data: { data: Group }) => {
      setExistingGroup(data.data);
      setUsersToAdd(data.data.users ?? []);
    };
    sendRequest({ path: `/group/${id}` }, applyData);
  }, [id, sendRequest]);

  useEffect(() => {
    if (id) {
      getExistingGroup();
      setSubmitMethod("put");
    }
  }, [id, getExistingGroup]);

  return {
    existingGroup,
    usersToAdd,
    isLoading,
    onSubmit: handleSubmit,
    onAddUsers: handleAddUsers,
    onUpdateUser: handleUpdateUser,
    onDeleteUser: handleDeleteUser,
  };
}

export default useGroupManage;
