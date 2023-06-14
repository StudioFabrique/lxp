import { FC, useContext, useEffect, useState } from "react";
import { AddUsersButton } from "./buttons.component";
import UserToAddList from "./user-to-add-list.component";
import usePagination from "../../../../hooks/use-pagination";
import { Context } from "../../../../store/context.store";
import Pagination from "../../../UI/pagination/pagination";
import RightSideDrawer from "../../../UI/right-side-drawer/right-side-drawer";

const GroupManageUserList: FC<{
  onSetUsersToAdd: (usersId: string[]) => void;
}> = (props) => {
  const { user, roles } = useContext(Context);

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isUserSettedUp, setUserSettedState] = useState(false);

  const {
    page,
    totalPages,
    dataList,
    sortData,
    handlePageNumber,
    setPath,
    perPage,
    setPerPages,
  } = usePagination("lastname", `/user/${user!.roles[0].role}`);

  const handleSetUsersToAdd = () => {
    console.log("users");

    console.log(selectedUsers);
    props.onSetUsersToAdd(selectedUsers);
  };

  const handleDeleteSelectedUser = (userId: string) => {
    setSelectedUsers((users) => users.filter((value) => value !== userId));
    setUserSettedState(false);
    console.log("id deleting : " + userId);
  };

  const handleAddSelectedUser = (userId: string) => {
    setSelectedUsers((users) => [...users, userId]);
    setUserSettedState(false);
    console.log("id adding : " + userId);
  };

  return (
    <RightSideDrawer>
      {dataList.length > 0 ? (
        <div className="h-full flex flex-col gap-y-5 justify-between">
          <UserToAddList
            selectedUsers={selectedUsers}
            userList={dataList}
            onAddSelectedUser={handleAddSelectedUser}
            onDeleteSelectedUser={handleDeleteSelectedUser}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            perPage={perPage}
            setPage={handlePageNumber}
            setPerPages={setPerPages}
          />
          <AddUsersButton
            onSetUsersToAdd={handleSetUsersToAdd}
            setUserSettedState={setUserSettedState}
            isUserSettedUp={isUserSettedUp}
          />
        </div>
      ) : (
        <p className="text-center">
          Aucun utilisateurs éligibles à être ajouté
        </p>
      )}
    </RightSideDrawer>
  );
};

export default GroupManageUserList;
