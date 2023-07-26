import { useNavigate } from "react-router-dom";
import useHttp from "../../hooks/use-http";
import Group from "../../utils/interfaces/group";
import GroupAddForm from "../../components/forms/group-form/group-add-form.component";
import GroupUserList from "../../components/lists/group-user-list/group-user-list.component";
import { useCallback, useState } from "react";
import User from "../../utils/interfaces/user";

const GroupAdd = () => {
  const [usersToAdd, setUsersToAdd] = useState<Array<User>>([]);

  const { error, isLoading, sendRequest } = useHttp();

  const handleSubmit = (group: Group) => {
    console.log(group);

    /* sendRequest(
      { method: "post", path: "/group", body: group },
      (data: any) => {
        if (data) return navigate(-1);
      }
    ); */
  };

  const handleAddUsers = (users: Array<User>) => {
    setUsersToAdd((currentUsers) => [...currentUsers, ...users]);
  };

  return (
    <div className="p-5 grid grid-rows-2 gap-y-5">
      <GroupAddForm
        onSubmitForm={handleSubmit}
        error={error}
        isLoading={isLoading}
      />
      <GroupUserList
        usersToAdd={usersToAdd}
        onSubmitSetUsersToAdd={handleAddUsers}
      />
    </div>
  );
};

export default GroupAdd;
