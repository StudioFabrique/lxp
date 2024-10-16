/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useCallback, useEffect, useState } from "react";
import { AddUsersButton } from "./group-manage-user-item/buttons.component";
import usePagination from "../../../../hooks/use-pagination";
import Pagination from "../../../UI/pagination/pagination";
import RightSideDrawer from "../../../UI/right-side-drawer/right-side-drawer";
import User from "../../../../utils/interfaces/user";
import Search from "../../../UI/search/search.component";
import UserToAddListHeader from "./user-to-add-list-header.component";
import GroupManageUserItem from "./group-manage-user-item/group-manage-user-item.component";

const GroupManageUserList: FC<{
  usersToAdd: User[];
  onAddUsers: (users: Array<User>) => void;
  drawerOptions?: { visible: boolean; isOpen: boolean };
  onCloseDrawer?: (id: string) => void;
}> = ({ usersToAdd, drawerOptions, onAddUsers, onCloseDrawer }) => {
  const {
    page,
    totalPages,
    dataList,
    handlePageNumber,
    perPage,
    setPerPage,
    stype,
    sortData,
    setAllChecked,
    allChecked,
  } = usePagination("lastname", "/user/byRank/3");

  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isUsersSettedUp, setUsersSettedState] = useState(true);
  const [userSearchResult, setUserSearchResult] = useState<User[]>([]);
  const [usersToShowsInList, setUsersToShowInList]: any[] = useState([]);

  const handleCloseDrawer = () => {
    setAllChecked(false);
    onCloseDrawer && onCloseDrawer("add-user-to-group");
  };

  const handleSetUsersToAdd = () => {
    onAddUsers(selectedUsers);
    const selectedUsersIds = selectedUsers.map(
      (selectedUser) => selectedUser._id,
    );
    setSelectedUsers((users) =>
      users.filter(
        (currentUser) => !selectedUsersIds.includes(currentUser._id),
      ),
    );
    handleCloseDrawer();
  };

  const handleAddSelectedUser = (user: User) => {
    setSelectedUsers((users) => [...users, user]);
    setUsersSettedState(false);
  };

  const handleAddSelectedAllUser = useCallback(() => {
    setSelectedUsers(usersToShowsInList);
    setUsersSettedState(false);
  }, [usersToShowsInList]);

  const handleRemoveSelectedAllUser = useCallback(() => {
    setSelectedUsers([]);
    setUsersSettedState(true);
  }, []);

  const handleDeleteSelectedUser = useCallback((user: User) => {
    setSelectedUsers((users) =>
      users.filter((currentUser) => currentUser._id !== user._id),
    );
    setUsersSettedState(false);
  }, []);

  /*
    Ajoute un utilisateur directement dans la liste sans checklist
   */
  const handleAddUserInstantly = (user: User) => {
    if (userSearchResult.length > 0) {
      setUserSearchResult([]);
    }
    onAddUsers([user]);
    setSelectedUsers((users) =>
      users.filter((currentUser) => currentUser._id !== user._id),
    );
  };

  const handleSearchUser = (entityToSearch: string, searchValue: string) => {
    const resultsFromSearch = usersToShowsInList.filter(
      (user: any) =>
        user[entityToSearch].toLowerCase() === searchValue.toLowerCase(),
    );

    setUserSearchResult(resultsFromSearch);
  };

  const handleResetSearchUser = () => {
    setUserSearchResult([]);
  };

  useEffect(() => {
    setUsersToShowInList(
      dataList.filter((data) => {
        return !usersToAdd.map((user) => user._id).includes(data._id);
      }),
    );
  }, [dataList, usersToAdd]);

  const renderUserItems = (users: User[]) => {
    return users.map((user: User) => (
      <GroupManageUserItem
        key={user._id}
        allUserSelected={allChecked}
        user={user}
        usersToAdd={usersToAdd}
        onAddSelectedUser={handleAddSelectedUser}
        onDeleteSelectedUser={handleDeleteSelectedUser}
        onAddUserInstantly={handleAddUserInstantly}
      />
    ));
  };

  useEffect(() => {
    if (allChecked) {
      handleAddSelectedAllUser();
    } else {
      handleRemoveSelectedAllUser();
    }
  }, [allChecked, handleAddSelectedAllUser, handleRemoveSelectedAllUser]);

  return (
    <RightSideDrawer
      title="Ajouter des étudiants au groupe"
      id="add-user-to-group"
      onCloseDrawer={handleCloseDrawer}
      visible={drawerOptions?.visible}
      isOpen={drawerOptions?.isOpen}
    >
      <div className="h-[80vh] w-[35rm]">
        <div className="flex flex-col gap-y-5 items-center  h-[85%]">
          <Search
            onResetInput={handleResetSearchUser}
            placeholder="Rechercher"
            onSearch={handleSearchUser}
            options={[
              { index: 0, option: "Prénom", value: "firstname" },
              { index: 1, option: "Nom", value: "lastname" },
              // { index: 2, option: "Formation", value: "group" },
            ]}
          />
          <div className="flex flex-col gap-y-4 w-full h-[85%]">
            {/* TOP */}
            <UserToAddListHeader
              setSelectAllUsers={setAllChecked}
              isAllUsersSelected={allChecked}
              order={stype}
              sortData={sortData}
              filters={[
                { filterValue: "firstname", placeholder: "Prénom" },
                { filterValue: "lastname", placeholder: "Nom" },
                // { filterValue: "group", placeholder: "Formation" },
              ]}
              value="test"
            />
            {/* MIDDLE */}
            {dataList.length > 0 ? (
              <div className="flex flex-col gap-y-5 h-full overflow-y-auto">
                {userSearchResult.length > 0
                  ? renderUserItems(userSearchResult)
                  : renderUserItems(dataList)}
              </div>
            ) : (
              <p className="text-center">
                Aucun utilisateurs éligibles à être ajouté
              </p>
            )}
            {/* BOTTOM */}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Pagination
            page={page}
            totalPages={totalPages}
            perPage={perPage}
            setPage={handlePageNumber}
            setPerPages={setPerPage}
          />
          <span className="self-end">
            <AddUsersButton
              onSetUsersToAdd={handleSetUsersToAdd}
              setUsersSettedState={setUsersSettedState}
              isUserSettedUp={isUsersSettedUp}
            />
          </span>
        </div>
      </div>
    </RightSideDrawer>
  );
};

export default GroupManageUserList;
