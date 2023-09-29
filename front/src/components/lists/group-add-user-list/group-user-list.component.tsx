import {
  DetailedHTMLProps,
  FC,
  HTMLAttributes,
  Ref,
  useEffect,
  useRef,
} from "react";
import GroupManageUserList from "./group-manage-user-list/group-manage-user-list";
import User from "../../../utils/interfaces/user";
import Wrapper from "../../UI/wrapper/wrapper.component";
import GroupUserItem from "./group-user-item.component";
import SearchSimple from "../../UI/search-simple/search-simple";
import CsvImportUserList from "./csv-import-user/csv-import-user-list/csv-import-user-list.component";
import LoadingIcon from "../../UI/svg/loading-icon.component";
import ThreeDotIcon from "../../UI/svg/three-dot-icon.component";
import useItems from "../../../hooks/use-items";
import useEagerLoadingList from "../../../hooks/use-eager-loading-list";
import Pagination from "../../UI/pagination/pagination";

const GroupUserList: FC<{
  usersToAdd: User[];
  onAddUsers: (users: Array<User>) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}> = ({ usersToAdd, onAddUsers, onUpdateUser, onDeleteUser }) => {
  const {
    page,
    setPage,
    totalPages,
    handleRowCheck,
    allChecked,
    setAllChecked,
    getSelecteditems,
    list,
  } = useEagerLoadingList(usersToAdd, "ASC", 10, "_id");

  const menuDiv: Ref<HTMLDivElement> = useRef(null);

  const handleToggleMenu = () => {
    menuDiv.current &&
      (menuDiv.current.style.visibility =
        menuDiv.current.style.visibility === "visible" ? "hidden" : "visible");
  };

  const handleDeleteUsersToAdd = () => {
    getSelecteditems()?.forEach((selectedItem) => onDeleteUser(selectedItem));
  };

  return (
    <Wrapper>
      <div className="flex justify-between">
        <h2 className="font-bold text-lg">Etudiants</h2>
        <div className="flex gap-x-2 items-center">
          <CsvImportUserList onAddUsers={onAddUsers} />
          <button type="button" className="btn btn-ghost px-2">
            <LoadingIcon />
          </button>
          <button
            type="button"
            className="btn btn-ghost px-2"
            onClick={handleToggleMenu}
          >
            <ThreeDotIcon />
          </button>
          <div
            ref={menuDiv}
            className="absolute whitespace-nowrap translate-y-12 invisible"
          >
            <button
              type="button"
              className="bg-secondary/80 p-2 rounded-lg"
              onClick={handleDeleteUsersToAdd}
            >
              Supprimer les utilisateurs selectionnés
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <GroupManageUserList onAddUsers={onAddUsers} usersToAdd={usersToAdd} />
        <SearchSimple placeholder="Rechercher un étudiant par nom ou prénom" />
      </div>

      {/* liste des utilisateurs du groupe */}
      {list && list.length > 0 ? (
        <>
          <table className="table-auto border-separate border-spacing-y-4">
            <thead>
              <tr className="text-lg">
                <th className="bg-transparent w-10">
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
              {list.map((item) => (
                <GroupUserItem
                  key={item._id}
                  itemProps={item}
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
        "Aucun utilisateurs dans ce groupe"
      )}
    </Wrapper>
  );
};
export default GroupUserList;
