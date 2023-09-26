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
}> = ({ usersToAdd, onAddUsers }) => {
  const {
    page,
    setPage,
    totalPages,
    dataList,
    handlePageNumber,
    perPage,
    setPerPage,
    stype,
    sortData,
    setAllChecked,
    allChecked,
  } = usePagination("lastname", `/user/student`);

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
  };

  const handleAddSelectedUser = (user: User) => {
    setSelectedUsers((users) => [...users, user]);
    setUsersSettedState(false);
    console.log("id adding : " + user);
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
    console.log("id deleting : " + user);
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
    console.log("id adding : " + user);
  };

  const handleSearchUser = (entityToSearch: string, searchValue: string) => {
    const resultsFromSearch = usersToShowsInList.filter(
      (user: any) =>
        user[entityToSearch].toLowerCase() === searchValue.toLowerCase()
    );
    console.log({ resultsFromSearch });

    setUserSearchResult(resultsFromSearch);
  };

  const handleResetSearchUser = () => {
    setUserSearchResult([]);
  };

  useEffect(() => {
    setUsersToShowInList(
      dataList.filter(
        (data) => {
          console.log(data);
          return !usersToAdd.map((user) => user._id).includes(data._id);
        }
        // !dataList
        //   .map((user) => user._id)
        //   .includes(usersToAdd.map((user) => user._id))
      )
    );
    console.log(usersToAdd);
  }, [dataList, usersToAdd]);

  useEffect(() => {
    if (allChecked) {
      handleAddSelectedAllUser();
    } else {
      handleRemoveSelectedAllUser();
    }
  }, [allChecked, handleAddSelectedAllUser, handleRemoveSelectedAllUser]);

  /**
   * Si le nombre d'utilisateurs pas encore ajoutés (usersToShowsInList) est vide,
   * alors incrémente le nombre de page jusqu'au maximum et revérifie
   * encore si des utilisateurs existent.
   */
  useEffect(() => {
    if (usersToShowsInList <= 0 && page < totalPages!) {
      setPage((page) => page + 1);
    }
  }, [usersToShowsInList, page, setPage, totalPages]);

  const renderUserItems = (users: User[]) => {
    return users.map((user: User) => (
      <GroupManageUserItem
        key={user._id}
        allUserSelected={allChecked}
        user={user}
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
      onCloseDrawer={() => setAllChecked(false)}
    >
      {usersToShowsInList.length > 0 ? (
        <div className="flex flex-col items-center gap-y-10 justify-between m-10">
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
          <div className="w-full flex flex-col gap-y-4">
            <UserToAddListHeader
              setSelectAllUsers={setAllChecked}
              order={stype}
              sortData={sortData}
              filters={[
                { filterValue: "firstname", placeholder: "Prénom" },
                { filterValue: "lastname", placeholder: "Nom" },
                // { filterValue: "group", placeholder: "Formation" },
              ]}
              value="test"
            />
            <div className="flex flex-col gap-y-5 h-full overflow-y-auto w-full">
              {userSearchResult.length > 0
                ? renderUserItems(userSearchResult)
                : renderUserItems(usersToShowsInList)}
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              perPage={perPage}
              setPage={handlePageNumber}
              setPerPages={setPerPage}
            />
          </div>
          <div className="w-full flex justify-end">
            <AddUsersButton
              onSetUsersToAdd={handleSetUsersToAdd}
              setUsersSettedState={setUsersSettedState}
              isUserSettedUp={isUsersSettedUp}
            />
          </div>
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
