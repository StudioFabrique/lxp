import useHttp from "../../hooks/use-http";
import GroupAddForm from "../../components/forms/group-form/group-add-form.component";
import GroupUserList from "../../components/lists/group-add-user-list/group-user-list.component";
import { useState } from "react";
import User from "../../utils/interfaces/user";
import toast, { Toaster } from "react-hot-toast";

const GroupAdd = () => {
  const [usersToAdd, setUsersToAdd] = useState<Array<User>>([]);

  const { error, isLoading, sendRequest } = useHttp();

  const handleSubmit = (data: any) => {
    console.log(data);
    console.log(usersToAdd);

    sendRequest(
      { method: "post", path: "/group", body: { ...data, users: usersToAdd } },
      (data: any) => {
        if (data) toast.success("Groupe créé avec succès");
      }
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
      <Toaster />
      <GroupAddForm
        onSubmitForm={handleSubmit}
        error={error}
        isLoading={isLoading}
      />
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
