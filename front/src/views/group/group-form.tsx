/* eslint-disable @typescript-eslint/no-explicit-any */
import GroupAddForm from "../../components/forms/group-form/group-form.component";
import GroupUserList from "../../components/lists/group-add-user-list/group-user-list";
import useGroupForm from "./use-group-form";

const GroupForm = () => {
  const {
    existingGroup,
    usersToAdd,
    isLoading,
    onSubmit,
    onAddUsers,
    onUpdateUser,
    onDeleteUser,
  } = useGroupForm();

  return (
    <div className="flex flex-col p-10 gap-y-10">
      <GroupAddForm
        title={existingGroup && "Modifier un groupe de formation"}
        group={existingGroup}
        onSubmitForm={onSubmit}
        isLoading={isLoading}
        isFileNotRequired
      />
      <GroupUserList
        usersToAdd={usersToAdd}
        onAddUsers={onAddUsers}
        onUpdateUser={onUpdateUser}
        onDeleteUser={onDeleteUser}
      />
    </div>
  );
};

export default GroupForm;
