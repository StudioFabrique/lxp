import { useNavigate } from "react-router-dom";
import useHttp from "../../hooks/use-http";
import Group from "../../utils/interfaces/group";
import GroupAddForm from "../../components/forms/group-form/group-add-form.component";
import GroupUserList from "../../components/lists/group-user-list/group-user-list.component";
import { useState } from "react";

const GroupAdd = () => {
  const [usersToAdd, setUsersToAdd] = useState<String[]>([]);

  const { error, isLoading, sendRequest } = useHttp();
  const navigate = useNavigate();

  const handleSubmit = (group: Group) => {
    console.log(group);
    /* sendRequest(
      { method: "post", path: "/group", body: group },
      (data: any) => {
        if (data) return navigate(-1);
      }
    ); */
  };

  return (
    <div className="p-5 grid grid-rows-2 gap-y-5">
      <GroupAddForm
        onSubmitForm={handleSubmit}
        error={error}
        isLoading={isLoading}
      />
      <GroupUserList users={[]} onSubmitSetUsersToAdd={setUsersToAdd} />
    </div>
  );
};

export default GroupAdd;
