/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect } from "react";
import Role from "../../../utils/interfaces/role";
import UserItem from "./user-item.component";
import SortColumnIcon from "../../UI/sort-column-icon.component/sort-column-icon.component";

const UserList: FC<{
  allChecked: boolean;
  role: Role;
  userList: Array<any>;
  page: number;
  sdir: boolean;
  stype: string;
  onRowCheck: (id: string) => void;
  onAllChecked: () => void;
  onSorting: (column: string) => void;
  onUncheckAll: () => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
  error?: string;
  sendInvitation: (userId: string) => void;
}> = ({
  allChecked,
  page,
  role,
  userList,
  sdir,
  stype,
  onRowCheck,
  onAllChecked,
  onSorting,
  onUncheckAll,
  onDelete,
  isLoading,
  error,
  sendInvitation,
}) => {
  const handleAllChecked = () => {
    onAllChecked();
  };

  useEffect(() => {
    onUncheckAll();
  }, [role, page, onUncheckAll]);

  const content = (
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
            <div className="flex items-center gap-x-2">
              <p>Prénom</p>
              <SortColumnIcon
                fieldSort={stype}
                column="firstname"
                direction={sdir}
              />
            </div>
          </th>
          <th
            className="cursor-pointer"
            onClick={() => {
              onSorting("lastname");
            }}
          >
            <div className="flex items-center gap-x-2">
              <p>Nom</p>
              <SortColumnIcon
                fieldSort={stype}
                column="lastname"
                direction={sdir}
              />
            </div>
          </th>
          <th
            className="cursor-pointer"
            onClick={() => {
              onSorting("email");
            }}
          >
            <div className="flex items-center gap-x-2">
              <p>Email</p>
              <SortColumnIcon
                fieldSort={stype}
                column="email"
                direction={sdir}
              />
            </div>
          </th>
          <th
            className="cursor-pointer"
            onClick={() => {
              onSorting("group");
            }}
          >
            <div className="flex items-center gap-x-2">
              <p>Formation</p>
              <SortColumnIcon
                fieldSort={stype}
                column="formation"
                direction={sdir}
              />
            </div>
          </th>
          <th
            className="cursor-pointer"
            onClick={() => {
              onSorting("group");
            }}
          >
            <div className="flex items-center gap-x-2">
              <p>Promotion</p>
              <SortColumnIcon
                fieldSort={stype}
                column="parcours"
                direction={sdir}
              />
            </div>
          </th>
          {role.role === "everything" ? <th>Role</th> : null}
          <th
            className="cursor-pointer"
            onClick={() => {
              onSorting("createdAt");
            }}
          >
            <div className="flex items-center gap-x-2">
              <p>Ajouté le</p>
              <SortColumnIcon
                fieldSort={stype}
                column="createdAt"
                direction={sdir}
              />
            </div>
          </th>
          <th
            className="cursor-pointer"
            onClick={() => {
              onSorting("isActive");
            }}
          >
            <div className="flex items-center gap-x-2">
              <p>Status</p>
              <SortColumnIcon
                fieldSort={stype}
                column="isActive"
                direction={sdir}
              />
            </div>
          </th>
          <th
            className="cursor-pointer"
            onClick={() => {
              onSorting("emailVerified");
            }}
          >
            <div className="flex items-center gap-x-2">
              <p>Email vérifié</p>
              <SortColumnIcon
                fieldSort={stype}
                column="emailVerified"
                direction={sdir}
              />
            </div>
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
            {
              <UserItem
                role={role.role}
                onDelete={onDelete}
                userItem={item}
                onRowCheck={onRowCheck}
                isUserDeleteLoading={isLoading}
                error={error}
                sendInvitation={sendInvitation}
              />
            }
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
