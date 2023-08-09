import useHttp from "../../hooks/use-http";
import Group from "../../utils/interfaces/group";
import GroupAddForm from "../../components/forms/group-form/group-add-form.component";
import GroupUserList from "../../components/lists/group-add-user-list/group-user-list.component";
import { useState } from "react";
import User from "../../utils/interfaces/user";
import { Toaster } from "react-hot-toast";

const GroupAdd = () => {
  const [usersToAdd, setUsersToAdd] = useState<Array<User>>([]);

  const { error, isLoading, sendRequest } = useHttp();

  const handleSubmit = (group: Group) => {
    console.log(group);

    sendRequest(
      { method: "post", path: "/group", body: group },
      (data: any) => {
        if (data) console.log("group created !");
      }
    );
  };

  const handleAddUsers = (users: Array<User>) => {
    setUsersToAdd((currentUsers) => [...currentUsers, ...users]);
  };

  return (
    <div className="flex flex-col p-10 gap-y-10">
      <Toaster />
      <GroupAddForm
        onSubmitForm={handleSubmit}
        error={error}
        isLoading={isLoading}
      />
      <GroupUserList usersToAdd={usersToAdd} onAddUsers={handleAddUsers} />
    </div>
  );
};

export default GroupAdd;
