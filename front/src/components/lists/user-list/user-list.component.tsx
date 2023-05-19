import { FC, useEffect, useState } from "react";
import Role from "../../../utils/interfaces/role";
import UserItem from "./user-item.component";

const UserList: FC<{
  role: Role;
  userList: Array<any>;
  onRowCheck: (id: string) => void;
  onAllChecked: (value: boolean) => void;
  onSorting: (column: string) => void;
}> = ({ role, userList, onRowCheck, onAllChecked, onSorting }) => {
  const [allChecked, setAllChecked] = useState(false);

  const handleAllChecked = () => {
    setAllChecked((prevAllChecked) => {
      return !prevAllChecked;
    });
    onAllChecked(allChecked);
  };

  // fonction pour changer les rôles d'un unique utilisateur, elle a été déplacé ailleurs

  /*   const handleRolesChange = (newRoles: Array<Role>, userId: string) => {
    const updatedUserList = userList.map((item: any) =>
      item._id === userId
        ? {
            ...item,
            roles: sortArray(newRoles, "rank"),
          }
        : item
    );
    setUserList(updatedUserList);

    const applyData = (data: any) => {};
    sendRequest(
      {
        path: `/user/${role.role === "admin" ? "user" : "student"}/${userId}`,
        method: "put",
        body: newRoles,
      },
      applyData
    );
  }; */

  useEffect(() => {
    setAllChecked(false);
    onAllChecked(false);
  }, [role, onAllChecked]);

  let content = (
    <table className="table w-full">
      <thead>
        <tr>
          <th className="z-0">
            <input
              className="my-auto checkbox"
              type="checkbox"
              checked={allChecked}
              onChange={handleAllChecked}
            />
          </th>
          <th></th>
          <th>Avatar</th>
          <th
            className="cursor-pointer"
            onClick={() => {
              onSorting("lastname");
            }}
          >
            Nom
          </th>
          <th
            className="cursor-pointer"
            onClick={() => {
              onSorting("firstname");
            }}
          >
            Prénom
          </th>
          <th
            className="cursor-pointer"
            onClick={() => {
              onSorting("email");
            }}
          >
            Email
          </th>
          <th
            className="cursor-pointer"
            onClick={() => {
              onSorting("formation");
            }}
          >
            Formation
          </th>
          <th
            className="cursor-pointer"
            onClick={() => {
              onSorting("isActive");
            }}
          >
            Status
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {userList.map((item: any) => (
          <tr className="hover:bg-primary/20" key={item._id}>
            {<UserItem userItem={item} onRowCheck={onRowCheck} />}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="flex flex-col gap-y-4">
      <>{userList.length > 0 ? <>{content}</> : <p>Rien à afficher</p>}</>
    </div>
  );
};

export default UserList;