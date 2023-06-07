import GroupManageUserList from "../group-manage-user-list/group-manage-user-list.component";

const GroupUserList = () => {
  const handleAddUsersToGroup = (users: String[]) => {};

  return (
    <div>
      <GroupManageUserList
        users={[
          {
            _id: "csdd542a",
            email: "test",
            firstname: "test",
            lastname: "test1",
            createdAt: new Date(),
            isActive: true,
            roles: [],
            updatedAt: new Date(),
          },
          {
            _id: "fsdkaj3s",
            email: "test32",
            firstname: "test7",
            lastname: "test1",
            createdAt: new Date(),
            isActive: true,
            roles: [],
            updatedAt: new Date(),
          },
        ]}
        addUsersToGroup={handleAddUsersToGroup}
      />
    </div>
  );
};
export default GroupUserList;
