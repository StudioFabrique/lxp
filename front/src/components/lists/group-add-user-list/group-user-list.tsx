import { FC, useEffect, useMemo, useState } from "react";
import GroupManageUserList from "./group-manage-user-list/group-manage-user-list";
import User from "../../../utils/interfaces/user";
import Wrapper from "../../UI/wrapper/wrapper.component";
import GroupUserItem from "./group-user-item";
import CsvImportUserList from "./csv-import-user/csv-import-user-list/csv-import-user-list.component";
import useEagerLoadingList from "../../../hooks/use-eager-loading-list";
import Pagination from "../../UI/pagination/pagination";
import SearchBar from "../../UI/search-bar/search-bar";
import ActionsDropdown from "../../UI/actions-dropdown/actions-dropdown";

const GroupUserList: FC<{
  usersToAdd: User[];
  onAddUsers: (users: Array<User>) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}> = ({ usersToAdd, onAddUsers, onUpdateUser, onDeleteUser }) => {
  const [filter, setFilter] = useState<string>();

  const usersToAddFiltered = useMemo(
    () =>
      usersToAdd &&
      usersToAdd?.filter((item) => {
        if (!filter) return true;
        const searchTerm = filter.toLowerCase();
        return (
          item.firstname.toLowerCase().includes(searchTerm) ||
          item.lastname.toLowerCase().includes(searchTerm)
        );
      }),
    [filter, usersToAdd],
  );

  const {
    page,
    setPage,
    totalPages,
    handleRowCheck,
    allChecked,
    setAllChecked,
    getSelecteditems,
    list,
  } = useEagerLoadingList(
    filter && filter?.length > 0 ? usersToAddFiltered : usersToAdd,
    "ASC",
    10,
    "_id",
  );

  const handleDeleteUsersToAdd = () => {
    getSelecteditems()?.forEach((selectedItem) => onDeleteUser(selectedItem));
  };

  const handleCloseDrawer = (id: string) => {
    document.getElementById(id)?.click();
  };

  useEffect(() => {
    setPage(totalPages);
  }, [setPage, totalPages]);

  return (
    <Wrapper>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-bold text-lg">Etudiants</h2>
        </div>
        <div className="flex gap-x-2 items-center">
          <CsvImportUserList
            onAddUsers={onAddUsers}
            usersAddedInTable={usersToAdd}
          />
          <ActionsDropdown
            actions={[
              {
                actionTitle: "Supprimer les étudiants selectionnés",
                data: null,
                onClick: handleDeleteUsersToAdd,
              },
            ]}
          />
        </div>
      </div>
      <div className="flex justify-between items-center w-full">
        <div className="flex gap-5 items-center">
          <GroupManageUserList
            onAddUsers={onAddUsers}
            usersToAdd={usersToAdd}
            onCloseDrawer={handleCloseDrawer}
          />
          {usersToAdd.length > 0 && (
            <p className="text-nowrap text-primary">
              <span className="font-bold">{usersToAdd.length}</span>
              {usersToAdd.length > 1
                ? " étudiants dans le groupe"
                : " étudiant dans le groupe"}
            </p>
          )}
        </div>
        <SearchBar
          onSetFilter={setFilter}
          placeholder="Rechercher un étudiant par nom ou prénom"
        />
      </div>

      {/* liste des utilisateurs du groupe */}
      {totalPages > 0 ? (
        <>
          <table className="table-auto border-separate border-spacing-y-4">
            <thead>
              <tr className="text-lg">
                <th className="bg-transparent w-10 pt-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    onChange={(e) => setAllChecked(e.currentTarget.checked)}
                    checked={allChecked}
                  />
                </th>
                <th className="bg-transparent"></th>
                <th className="bg-transparent text-start">Prénom</th>
                <th className="bg-transparent text-start">Nom</th>
                <th className="bg-transparent text-start">Email</th>
                <th className="bg-transparent text-start">Formation</th>
                <th className="bg-transparent text-start">Status</th>
                <th className="bg-transparent"></th>
                <th className="bg-transparent"></th>
              </tr>
            </thead>
            <tbody>
              {list &&
                list.map((item) => (
                  <GroupUserItem
                    key={item._id}
                    user={item}
                    onUpdateUser={onUpdateUser}
                    onDeleteUser={onDeleteUser}
                    onCheckRow={handleRowCheck}
                  />
                ))}
            </tbody>
          </table>

          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        </>
      ) : (
        "Aucun étudiants"
      )}
    </Wrapper>
  );
};
export default GroupUserList;
