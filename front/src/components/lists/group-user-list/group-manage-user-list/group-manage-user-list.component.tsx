import { FC, useContext, useState } from "react";
import { AddUsersButton } from "./buttons.component";
import UserToAddList from "./user-to-add-list.component";
import usePagination from "../../../../hooks/use-pagination";
import { Context } from "../../../../store/context.store";
import Pagination from "../../../UI/pagination/pagination";
import RightSideDrawer from "../../../UI/right-side-drawer/right-side-drawer";
import User from "../../../../utils/interfaces/user";

const GroupManageUserList: FC<{
  onSetUsersToAdd: (users: Array<User>) => void;
}> = (props) => {
  const { user } = useContext(Context);

  const [selectedUsers, setSelectedUsers] = useState<Array<User>>([]);
  const [isUsersSettedUp, setUsersSettedState] = useState(true);

  const { page, totalPages, dataList, handlePageNumber, perPage, setPerPage } =
    usePagination("lastname", `/user/${user!.roles[0].role}`);

  const handleSetUsersToAdd = () => {
    console.log(selectedUsers);
    props.onSetUsersToAdd(selectedUsers);
  };

  const handleDeleteSelectedUser = (userId: string) => {
    setSelectedUsers((users) => users.filter((value) => value._id !== userId));
    setUsersSettedState(false);
    console.log("id deleting : " + userId);
  };

  const handleAddSelectedUser = (user: User) => {
    setSelectedUsers((users) => [...users, user]);
    setUsersSettedState(false);
    console.log("id adding : " + user);
  };

  return (
    <RightSideDrawer
      title="Ajouter des étudiants au groupe"
      id="add-user-to-group"
    >
      <div className="flex flex-col items-center gap-y-5">
        {dataList.length > 0 ? (
          <div className="h-full flex flex-col gap-y-5 justify-between">
            <UserToAddList
              selectedUsers={selectedUsers}
              userList={dataList}
              onAddSelectedUser={handleAddSelectedUser}
              onDeleteSelectedUser={handleDeleteSelectedUser}
              isUsersSettedUp={isUsersSettedUp}
            />
            <Pagination
              page={page}
              totalPages={totalPages}
              perPage={perPage}
              setPage={handlePageNumber}
              setPerPages={setPerPage}
            />
            <AddUsersButton
              onSetUsersToAdd={handleSetUsersToAdd}
              setUsersSettedState={setUsersSettedState}
              isUserSettedUp={isUsersSettedUp}
            />
          </div>
        ) : (
          <p className="text-center">
            Aucun utilisateurs éligibles à être ajouté
          </p>
        )}
      </div>
    </RightSideDrawer>
  );
};

export default GroupManageUserList;
