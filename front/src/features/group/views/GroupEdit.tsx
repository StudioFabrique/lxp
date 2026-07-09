import { useSearchParams } from "react-router";
import GroupForm from "../components/group-form/GroupForm";
import GroupUserList from "../../../../src/components/lists/group-add-user-list/group-user-list";
import useGroupManage from "../hooks/useGroupManage";

const GroupEdit = () => {
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

export default GroupEdit;
