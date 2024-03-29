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
  onCloseDrawer?: () => void;
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

  const handleSetUsersToAdd = () => {
    onAddUsers(selectedUsers);
    const selectedUsersIds = selectedUsers.map(
      (selectedUser) => selectedUser._id
    );
    setSelectedUsers((users) =>
      users.filter((currentUser) => !selectedUsersIds.includes(currentUser._id))
    );
    setAllChecked(false);
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

  const handleDeleteSelectedUser = (user: User) => {
    setSelectedUsers((users) =>
      users.filter((currentUser) => currentUser._id !== user._id)
    );
    setUsersSettedState(false);
  };

  /* 
    Ajoute un utilisateur directement dans la liste sans checklist
   */
  const handleAddUserInstantly = (user: User) => {
    if (userSearchResult.length > 0) {
      setUserSearchResult([]);
    }
    onAddUsers([user]);
    setSelectedUsers((users) =>
      users.filter((currentUser) => currentUser._id !== user._id)
    );
  };

  const handleSearchUser = (entityToSearch: string, searchValue: string) => {
    const resultsFromSearch = usersToShowsInList.filter(
      (user: any) =>
        user[entityToSearch].toLowerCase() === searchValue.toLowerCase()
    );

    setUserSearchResult(resultsFromSearch);
  };

  const handleResetSearchUser = () => {
    setUserSearchResult([]);
  };

  const handleCloseDrawer = () => {
    setAllChecked(false);
    onCloseDrawer && onCloseDrawer();
  };

  useEffect(() => {
    setUsersToShowInList(
      dataList.filter((data) => {
        return !usersToAdd.map((user) => user._id).includes(data._id);
      })
    );
  }, [dataList, usersToAdd]);

  useEffect(() => {
    if (allChecked) {
      handleAddSelectedAllUser();
    } else {
      handleRemoveSelectedAllUser();
    }
  }, [allChecked, handleAddSelectedAllUser, handleRemoveSelectedAllUser]);

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

  return (
    <RightSideDrawer
      title="Ajouter des étudiants au groupe"
      id="add-user-to-group"
      onCloseDrawer={handleCloseDrawer}
      visible={drawerOptions?.visible}
      isOpen={drawerOptions?.isOpen}
    >
      <div className="flex flex-col items-center gap-y-10 justify-between m-10 h-[74vh]">
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
        <div className="flex flex-col justify-between gap-y-4 h-full">
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
            <div className="flex flex-col h-full my-5 gap-y-5 overflow-y-auto">
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
          <Pagination
            page={page}
            totalPages={totalPages}
            perPage={perPage}
            setPage={handlePageNumber}
            setPerPages={setPerPage}
          />
        </div>
        <div className="flex">
          <AddUsersButton
            onSetUsersToAdd={handleSetUsersToAdd}
            setUsersSettedState={setUsersSettedState}
            isUserSettedUp={isUsersSettedUp}
          />
        </div>
      </div>
    </RightSideDrawer>
  );
};

export default GroupManageUserList;
