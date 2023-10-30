import useHttp from "../../hooks/use-http";
import GroupAddForm from "../../components/forms/group-form/group-add-form.component";
import GroupUserList from "../../components/lists/group-add-user-list/group-user-list.component";
import { useState } from "react";
import User from "../../utils/interfaces/user";
import { useNavigate } from "react-router-dom";

const GroupAdd = () => {
  const navigate = useNavigate();
  const { isLoading, sendRequest } = useHttp(true);
  const [usersToAdd, setUsersToAdd] = useState<Array<User>>([]);

  const handleSubmit = (data: any, file: File) => {
    const applyData = (data: any) => {
      navigate("/admin/group", {
        state: { toastFrom: "Groupe créé avec succès" },
      });
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify({ ...data, users: usersToAdd }));
    formData.append("image", file);

    sendRequest({ method: "post", path: "/group", body: formData }, applyData);
  };

  const handleAddUsers = (users: Array<User>) => {
    setUsersToAdd((currentUsers) => [...currentUsers, ...users]);
  };

  const handleUpdateUser = (user: User) => {
    setUsersToAdd((usersToAdd) =>
      usersToAdd.map((userToAdd) =>
        userToAdd._id === user._id
          ? { ...userToAdd, isActive: user.isActive }
          : userToAdd
      )
    );
  };

  const handleDeleteUser = (user: User) => {
    setUsersToAdd((usersToAdd) =>
      usersToAdd.filter((userToAdd) => userToAdd._id !== user._id)
    );
  };

  return (
    <div className="flex flex-col p-10 gap-y-10">
      <GroupAddForm onSubmitForm={handleSubmit} isLoading={isLoading} />
      <GroupUserList
        usersToAdd={usersToAdd}
        onAddUsers={handleAddUsers}
        onUpdateUser={handleUpdateUser}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
};

export default GroupAdd;
