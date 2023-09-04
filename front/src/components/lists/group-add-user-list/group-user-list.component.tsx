import { FC, useState } from "react";
import GroupManageUserList from "./group-manage-user-list/group-manage-user-list.component";
import User from "../../../utils/interfaces/user";
import Wrapper from "../../UI/wrapper/wrapper.component";
import GroupUserItem from "./group-user-item.component";
import SearchSimple from "../../UI/search-simple/search-simple";
import CsvImportUserList from "./csv-import-user/csv-import-user-list/csv-import-user-list.component";
import LoadingIcon from "../../UI/svg/loading-icon.component";
import ThreeDotIcon from "../../UI/svg/three-dot-icon.component";

const GroupUserList: FC<{
  usersToAdd: User[];
  onAddUsers: (users: Array<User>) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}> = ({ usersToAdd, onAddUsers, onUpdateUser, onDeleteUser }) => {
  const [needDataUpdate, setDataUpdateState] = useState<boolean>(false);

  return (
    <Wrapper>
      <div className="flex justify-between">
        <h2 className="font-bold text-lg">Etudiants</h2>
        <div className="flex gap-x-5">
          <CsvImportUserList
            setDataUpdateState={setDataUpdateState}
            onAddUsers={onAddUsers}
          />
          <LoadingIcon />
          <ThreeDotIcon />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <GroupManageUserList
          needDataUpdate={needDataUpdate}
          setDataUpdateState={setDataUpdateState}
          onAddUsers={onAddUsers}
          usersToAdd={usersToAdd}
        />
        <SearchSimple placeholder="Rechercher un étudiant par nom ou prénom" />
      </div>

      {/* liste des utilisateurs du groupe */}
      {usersToAdd.length > 0 ? (
        <>
          <table className="table-auto border-separate border-spacing-y-4">
            <thead>
              <tr className="text-lg">
                <th className="bg-transparent "></th>
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
              {usersToAdd.map((user) => (
                <GroupUserItem
                  key={user._id}
                  user={user}
                  onUpdateUser={onUpdateUser}
                  onDeleteUser={onDeleteUser}
                />
              ))}
            </tbody>
          </table>
        </>
      ) : (
        "Aucun utilisateurs dans ce groupe"
      )}
    </Wrapper>
  );
};
export default GroupUserList;
