import { FC, useEffect } from "react";
import Role from "../../../utils/interfaces/role";
import UserItem from "./user-item.component";

const UserList: FC<{
  allChecked: boolean;
  role: Role;
  userList: Array<any>;
  onRowCheck: (id: string) => void;
  onAllChecked: () => void;
  onSorting: (column: string) => void;
  onUncheckAll: () => void;
}> = ({
  allChecked,
  role,
  userList,
  onRowCheck,
  onAllChecked,
  onSorting,
  onUncheckAll,
}) => {
  const handleAllChecked = () => {
    onAllChecked();
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
    if (userList.some((item) => !item.isSelected)) {
      onUncheckAll();
    }
  }, [userList, onUncheckAll]);

  useEffect(() => {
    onUncheckAll();
  }, [role, onUncheckAll]);

  let content = (
    <table className="table w-full border-separate border-spacing-y-2">
      <thead>
        <tr>
          <th>
            <input
              className="my-auto checkbox checkbox-sm rounded-md checkbox-primary"
              type="checkbox"
              checked={allChecked}
              onChange={handleAllChecked}
            />
          </th>
          <th>Avatar</th>
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
              onSorting("lastname");
            }}
          >
            Nom
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
              onSorting("group");
            }}
          >
            Formation
          </th>
          <th
            className="cursor-pointer"
            onClick={() => {
              onSorting("group");
            }}
          >
            Promotion
          </th>
          <th
            className="cursor-pointer"
            onClick={() => {
              onSorting("createdAt");
            }}
          >
            Ajouté le
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
          <tr
            className="bg-secondary/10 hover:bg-secondary/20 hover:text-base-content"
            key={item._id}
          >
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
