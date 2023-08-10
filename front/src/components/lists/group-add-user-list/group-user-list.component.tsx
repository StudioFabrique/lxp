import { FC, useState } from "react";
import GroupManageUserList from "./group-manage-user-list/group-manage-user-list.component";
import User from "../../../utils/interfaces/user";
import Wrapper from "../../UI/wrapper/wrapper.component";
import CsvImportUserList from "../../UI/csv-import/csv-import-user-list/csv-import-user-list.component";
import GroupUserItem from "./group-user-item.component";
import SearchSimple from "../../UI/search-simple/search-simple";

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
        <CsvImportUserList
          setDataUpdateState={setDataUpdateState}
          onAddUsers={onAddUsers}
        />
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
                <th className="bg-transparent">test</th>
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
