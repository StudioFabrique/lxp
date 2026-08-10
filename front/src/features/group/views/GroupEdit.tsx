import { useSearchParams } from "react-router";
import GroupForm from "../components/group-form/GroupForm";
import GroupUserList from "../components/users/group-add-user-list/group-user-list";
import useGroupManage from "../hooks/useGroupManage";

const GroupEdit = () => {
  const [searchParams] = useSearchParams();
  const fromParcours = searchParams.get("parcours");

  const {
    form,
    isEditing,
    usersToAdd,
    isLoading,
    onSubmit,
    onAddUsers,
    onDeleteUser,
    onCreateStudent,
  } = useGroupManage();

  return (
    <GroupForm
      form={form}
      isEditing={isEditing}
      onSubmitForm={onSubmit}
      isLoading={isLoading}
      fromParcours={fromParcours ?? undefined}
    >
      <GroupUserList
        usersToAdd={usersToAdd}
        onAddUsers={onAddUsers}
        onDeleteUser={onDeleteUser}
        onCreateStudent={onCreateStudent}
      />
    </GroupForm>
  );
};

export default GroupEdit;
