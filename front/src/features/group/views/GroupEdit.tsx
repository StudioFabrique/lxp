import { useSearchParams } from "react-router";
import GroupForm from "../components/group-form/GroupForm";
import GroupUserList from "../components/users/group-add-user-list/group-user-list";
import GroupEmptyWarningModal from "../components/group-form/GroupEmptyWarningModal";
import useGroupManage from "../hooks/useGroupManage";

const GroupEdit = () => {
  const [searchParams] = useSearchParams();
  const fromParcours = searchParams.get("parcours");

  const {
    form,
    existingGroup,
    isEditing,
    usersToAdd,
    isLoading,
    isEmptyGroupWarningOpen,
    onConfirmEmptyGroup,
    onCancelEmptyGroup,
    onSubmit,
    onAddUsers,
    onDeleteUser,
    onCreateStudent,
  } = useGroupManage();

  return (
    <>
      <GroupForm
        form={form}
        existingGroup={existingGroup}
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
        {isEmptyGroupWarningOpen ? (
          <GroupEmptyWarningModal
            isEditing={isEditing}
            onConfirm={onConfirmEmptyGroup}
            onCancel={onCancelEmptyGroup}
          />
        ) : null}
      </GroupForm>
    </>
  );
};

export default GroupEdit;
