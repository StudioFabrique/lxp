import { FC, useState } from "react";
import GroupManageUserList from "../group-manage-user-list/group-manage-user-list.component";
import GroupUserItem from "./group-user-item.component";
import { ButtonAdd } from "./buttons.component";
import User from "../../../utils/interfaces/user";
import Wrapper from "../../UI/wrapper/wrapper.component";

const GroupUserList: FC<{
  users: User[];
  onSetUsersToAdd: (Users: string[]) => void;
}> = ({ users, onSetUsersToAdd }) => {
  const [isModalOpen, setModalOpenState] = useState<boolean>(false);

  const handleModalOpenState = () => {
    setModalOpenState(!isModalOpen);
  };

  const handleSetUsersToAdd = (users: string[]) => {
    onSetUsersToAdd(users);
    handleModalOpenState();
  };

  return (
    <div>
      {/* Afficher ici la liste des utilisateurs du groupe */}
      <Wrapper>
        <h2 className="font-bold text-lg">Etudiants</h2>
        <div className="flex justify-between">
          <ButtonAdd onClick={handleModalOpenState} />
        </div>

        {/* Afficher ici la liste des utilisateurs du groupe */}
        {users.length > 0 ? (
          <table className="table tab-sm">
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
        ) : (
          "Aucun utilisateurs dans ce groupe"
        )}
      </Wrapper>
      {isModalOpen ? (
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
          onSetUsersToAdd={handleSetUsersToAdd}
          onClose={handleModalOpenState}
        />
      ) : undefined}
    </div>
  );
};
export default GroupUserList;
