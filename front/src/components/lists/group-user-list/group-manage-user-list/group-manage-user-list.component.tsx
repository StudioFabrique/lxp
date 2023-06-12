import { FC, useContext, useEffect, useState } from "react";
import User from "../../../../utils/interfaces/user";
import { AddUsersButton, CancelButton } from "./buttons.component";
import UserToAddList from "./user-to-add-list.component";
import useHttp from "../../../../hooks/use-http";
import usePagination from "../../../../hooks/use-pagination";
import { Context } from "../../../../store/context.store";
import Pagination from "../../../UI/pagination/pagination";

const GroupManageUserList: FC<{
  onSetUsersToAdd: (usersId: string[]) => void;
  onClose: () => void;
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

  const handleCleanup = () => {
    setSelectedUsers([]);
    props.onSetUsersToAdd([]);
    props.onClose();
  };

  return (
    <div className="fixed h-full flex top-0 right-0">
      <div className="bg-white p-10 flex flex-col h-full gap-y-5 justify-between">
        <CancelButton onCleanup={handleCleanup} />
        {dataList.length > 0 ? (
          <>
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
          </>
        ) : (
          <p className="text-center">
            Aucun utilisateurs éligibles à être ajouté
          </p>
        )}
      </div>
    </div>
  );
};

export default GroupManageUserList;
