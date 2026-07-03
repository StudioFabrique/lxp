import { useSearchParams } from "react-router";
import GroupForm from "../../components/forms/group-form/group-form.component";
import GroupUserList from "../../components/lists/group-add-user-list/group-user-list";
import useGroupManage from "../hooks/use-group-manage";

const GroupManage = () => {
  const [searchParams] = useSearchParams();
  const fromParcours = searchParams.get("parcours");

  const {
    existingGroup,
    usersToAdd,
    isLoading,
    onSubmit,
    onAddUsers,
    onUpdateUser,
    onDeleteUser,
  } = useGroupManage();

  return (
    <>
      <GroupForm
        title={existingGroup && "Modifier un groupe de formation"}
        group={existingGroup}
        onSubmitForm={onSubmit}
        isLoading={isLoading}
        isFileNotRequired
        fromParcours={fromParcours ?? undefined}
      />
      <GroupUserList
        usersToAdd={usersToAdd}
        onAddUsers={onAddUsers}
        onUpdateUser={onUpdateUser}
        onDeleteUser={onDeleteUser}
      />
    </>
  );
};

export default GroupManage;
