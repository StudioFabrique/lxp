import { useState } from "react";
import GroupManageUserList from "../group-manage-user-list/group-manage-user-list.component";
import User from "../../../utils/interfaces/user";
import GroupUserItem from "./group-user-item.component";
import { ButtonAdd } from "./buttons.component";

const GroupUserList = () => {
  const [users, setUsers] = useState<User[]>([
    {
      _id: "csdd542a",
      email: "test",
      firstname: "test",
      lastname: "test1",
      createdAt: new Date(),
      isActive: true,
      roles: [],
      updatedAt: new Date(),
    },
    {
      _id: "fsdkaj3s",
      email: "test32",
      firstname: "test7",
      lastname: "test1",
      createdAt: new Date(),
      isActive: true,
      roles: [],
      updatedAt: new Date(),
    },
  ]);
  const handleAddUsersToGroup = (users: String[]) => {};

  return (
    <div>
      {/* Afficher ici la liste des utilisateurs du groupe */}
      <div className="p-4 bg-slate-100/80 rounded-2xl flex flex-col gap-y-5">
        <h2 className="font-bold text-lg">Etudiants</h2>
        <div className="flex justify-between">
          <div className="btn btn-sm bg-indigo-500 text-white flex justify-between">
            <ButtonAdd /> <p>Ajouter un étudiant</p>
          </div>
        </div>

        {/* Afficher ici la liste des utilisateurs du groupe */}
        {users.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th></th>
                <th>Prénom</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Formation</th>
                <th>Status</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <GroupUserItem key={i} user={user} />
              ))}
            </tbody>
          </table>
        ) : (
          "Aucun utilisateurs dans ce groupe"
        )}
      </div>
      <GroupManageUserList
        users={[
          {
            _id: "csdd542a",
            email: "test",
            firstname: "test",
            lastname: "test1",
            createdAt: new Date(),
            isActive: true,
            roles: [],
            updatedAt: new Date(),
          },
          {
            _id: "fsdkaj3s",
            email: "test32",
            firstname: "test7",
            lastname: "test1",
            createdAt: new Date(),
            isActive: true,
            roles: [],
            updatedAt: new Date(),
          },
        ]}
        addUsersToGroup={handleAddUsersToGroup}
      />
    </div>
  );
};
export default GroupUserList;
