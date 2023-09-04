import {
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { AddUsersButton } from "./group-manage-user-item/buttons.component";
import UserToAddList from "./user-to-add-list/user-to-add-list.component";
import usePagination from "../../../../hooks/use-pagination";
import { Context } from "../../../../store/context.store";
import Pagination from "../../../UI/pagination/pagination";
import RightSideDrawer from "../../../UI/right-side-drawer/right-side-drawer";
import User from "../../../../utils/interfaces/user";
import Search from "../../../UI/search/search.component";
import UserToAddListHeader from "./user-to-add-list/user-to-add-list-header.component";

const GroupManageUserList: FC<{
  needDataUpdate: boolean;
  usersToAdd: User[];
  setDataUpdateState: Dispatch<SetStateAction<boolean>>;
  onAddUsers: (users: Array<User>) => void;
}> = (props) => {
  const { user } = useContext(Context);

  const [selectedUsers, setSelectedUsers] = useState<Array<User>>([]);
  const [isUsersSettedUp, setUsersSettedState] = useState(true);
  const [userSearchResult, setUserSearchResult] = useState<User[]>([]);

  const {
    page,
    totalPages,
    dataList,
    handlePageNumber,
    perPage,
    setPerPage,
    getList,
    setDataList,
    setStype,
    stype,
    sortData,
  } = usePagination("lastname", `/user/${user!.roles[0].role}`);

  const handleSetUsersToAdd = () => {
    props.onAddUsers(selectedUsers);
    const selectedUsersIds = selectedUsers.map(
      (selectedUser) => selectedUser._id
    );
    setDataList((currentUsers) => {
      return currentUsers.filter(
        (currentUser) => !selectedUsersIds.includes(currentUser._id)
      );
    });
    setSelectedUsers((users) =>
      users.filter((currentUser) => !selectedUsersIds.includes(currentUser._id))
    );
  };

  const handleAddSelectedUser = (user: User) => {
    setSelectedUsers((users) => [...users, user]);
    setUsersSettedState(false);
    console.log("id adding : " + user);
  };

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
    props.onAddUsers([user]);
    setSelectedUsers((users) =>
      users.filter((currentUser) => currentUser._id !== user._id)
    );
    setDataList((users) => users.filter((value) => value._id !== user._id));
    console.log("id adding : " + user);
  };

  const handleSearchUser = (entityToSearch: string, searchValue: string) => {
    const result = dataList.filter(
      (user) => user[entityToSearch].toLowerCase() === searchValue.toLowerCase()
    );
    console.log(result);

    setUserSearchResult(result);
  };

  useEffect(() => {
    if (props.needDataUpdate) {
      getList();
      props.setDataUpdateState(false);
    }
  }, [props, getList]);

  return (
    <RightSideDrawer
      title="Ajouter des étudiants au groupe"
      id="add-user-to-group"
    >
      {dataList.length > 0 ? (
        <div className="flex flex-col items-center gap-y-10 justify-between m-10">
          <Search
            placeholder="Rechercher"
            onSearch={handleSearchUser}
            options={[
              { index: 0, option: "Prénom", value: "firstname" },
              { index: 1, option: "Nom", value: "lastname" },
              { index: 2, option: "Formation", value: "group" },
            ]}
          />
          <div className="w-full flex flex-col gap-y-4">
            <UserToAddListHeader
              order={stype}
              sortData={sortData}
              filters={[
                { filterValue: "firstname", placeholder: "Prénom" },
                { filterValue: "lastname", placeholder: "Nom" },
                { filterValue: "group", placeholder: "Formation" },
              ]}
              value="test"
            />
            <UserToAddList
              selectedUsers={selectedUsers}
              userList={
                userSearchResult.length > 0 ? userSearchResult : dataList
              }
              usersToAdd={props.usersToAdd}
              onAddSelectedUser={handleAddSelectedUser}
              onDeleteSelectedUser={handleDeleteSelectedUser}
              onAddUserInstantly={handleAddUserInstantly}
              isUsersSettedUp={isUsersSettedUp}
            />

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
