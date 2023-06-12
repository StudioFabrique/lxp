import { FC, useState } from "react";
import GroupManageUserList from "./group-manage-user-list/group-manage-user-list.component";
import GroupUserItem from "./group-user-item.component";
import { ButtonAdd } from "./buttons.component";
import User from "../../../utils/interfaces/user";
import Wrapper from "../../UI/wrapper/wrapper.component";
import Pagination from "../../UI/pagination/pagination";
import usePagination from "../../../hooks/use-pagination";

const GroupUserList: FC<{
  users: User[];
  onSubmitSetUsersToAdd: (Users: string[]) => void;
}> = ({ users, onSubmitSetUsersToAdd }) => {
  const [isModalOpen, setModalOpenState] = useState<boolean>(false);

  const { page, perPage, dataList, totalPages, handlePageNumber } =
    usePagination("", "");
  const handleModalOpenState = () => {
    setModalOpenState(!isModalOpen);
  };

  const handleSetUsersToAdd = (users: string[]) => {
    onSubmitSetUsersToAdd(users);
    handleModalOpenState();
  };

  return (
    <Wrapper>
      <h2 className="font-bold text-lg">Etudiants</h2>
      <div className="flex justify-between">
        <ButtonAdd onClick={handleModalOpenState} />
        <input
          type="text"
          className="input input-sm"
          placeholder="Rechercher un étudiant par nom ou prénom"
        />
      </div>

      {/* liste des utilisateurs du groupe */}
      {users.length > 0 ? (
        <>
          <table className="table-auto tab-sm border-separate border-spacing-y-4 text-center">
            <thead>
              <tr>
                <th className="bg-transparent"></th>
                <th className="bg-transparent"></th>
                <th className="bg-transparent">Prénom</th>
                <th className="bg-transparent">Nom</th>
                <th className="bg-transparent">Email</th>
                <th className="bg-transparent">Formation</th>
                <th className="bg-transparent">Status</th>
                <th className="bg-transparent"></th>
                <th className="bg-transparent"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <GroupUserItem key={i} user={user} />
              ))}
            </tbody>
          </table>
          <Pagination
            page={page}
            setPage={handlePageNumber}
            totalPages={totalPages}
            perPage={perPage}
          />
        </>
      ) : (
        "Aucun utilisateurs dans ce groupe"
      )}
      {isModalOpen ? (
        <GroupManageUserList
          onSetUsersToAdd={handleSetUsersToAdd}
          onClose={handleModalOpenState}
        />
      ) : undefined}
    </Wrapper>
  );
};
export default GroupUserList;
