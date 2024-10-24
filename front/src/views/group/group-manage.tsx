import GroupForm from "../../components/forms/group-form/group-form.component";
import GroupUserList from "../../components/lists/group-add-user-list/group-user-list";
import useGroupManage from "./hooks/use-group-manage";

const GroupManage = () => {
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
    <div className="flex flex-col p-10 gap-10">
      <GroupForm
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
        isLoading={isLoading}
      />
    </div>
  );
};

export default GroupManage;
