import { FC, useContext, useState } from "react";
import { AddUsersButton } from "./buttons.component";
import UserToAddList from "./user-to-add-list.component";
import usePagination from "../../../../hooks/use-pagination";
import { Context } from "../../../../store/context.store";
import Pagination from "../../../UI/pagination/pagination";
import RightSideDrawer from "../../../UI/right-side-drawer/right-side-drawer";
import CsvImport from "./csv-import/csv-import";

const GroupManageUserList: FC<{
  onSetUsersToAdd: (usersId: string[]) => void;
}> = (props) => {
  const { user } = useContext(Context);

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isUserSettedUp, setUserSettedState] = useState(false);

  const { page, totalPages, dataList, handlePageNumber, perPage, setPerPage } =
    usePagination("lastname", `/user/${user!.roles[0].role}`);

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

  const handleImportUser = (users: Array<any>) => {};

  return (
    <RightSideDrawer title="Ajouter des Utilisateurs" id="add-user-to-group">
      <div className="flex flex-col items-center gap-y-5">
        <CsvImport onImportUsers={handleImportUser} />
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
              setPerPages={setPerPage}
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
      </div>
    </RightSideDrawer>
  );
};

export default GroupManageUserList;
