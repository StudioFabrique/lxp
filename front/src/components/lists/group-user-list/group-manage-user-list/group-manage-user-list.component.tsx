import { FC, useContext, useEffect, useState } from "react";
import User from "../../../../utils/interfaces/user";
import { AddUsersButton } from "./buttons.component";
import UserToAddList from "./user-to-add-list.component";
import useHttp from "../../../../hooks/use-http";
import usePagination from "../../../../hooks/use-pagination";
import { Context } from "../../../../store/context.store";
import Pagination from "../../../UI/pagination/pagination";
import RightSideDrawer from "../../../UI/right-side-drawer/right-side-drawer";

const GroupManageUserList: FC<{
  onSetUsersToAdd: (usersId: string[]) => void;
}> = (props) => {
  const { user, roles } = useContext(Context);
  const { sendRequest, isLoading, error } = useHttp();

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

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

  const handleManageSelectedUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers((users) => users.filter((value) => value !== userId));
    } else {
      setSelectedUsers((users) => [...users, userId]);
    }
  };

  return (
    <RightSideDrawer>
      {dataList.length > 0 ? (
        <div className="flex flex-col gap-y-10 h-full justify-between">
          <div className="h-full flex flex-col justify-between">
            <UserToAddList
              userList={dataList}
              ManageSelectedUser={handleManageSelectedUser}
            />
            <Pagination
              page={page}
              totalPages={totalPages}
              perPage={perPage}
              setPage={handlePageNumber}
              setPerPages={setPerPages}
            />
          </div>
          <AddUsersButton
            onSetUsersToAdd={props.onSetUsersToAdd}
            selectedUsers={selectedUsers}
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
