/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Dispatch, FC, useCallback, useEffect, useMemo } from "react";
import Role from "../../../utils/interfaces/role";
import UserItem from "./user-item.component";
import SortColumnIcon from "../../UI/sort-column-icon.component/sort-column-icon.component";
import TableWrapper from "../../UI/table-wrapper";
import TableRowWrapper from "../../UI/table-row-wrapper";
import ElementNotFound from "../../UI/element-not-found";

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
  onDelete: Dispatch<React.SetStateAction<string | null>>;
  isLoading: boolean;
  error?: string;
  sendInvitation: (userId: string) => void;
  onToggleStatus: (id: string, value: boolean) => void;
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
  onToggleStatus,
}) => {
  const handleAllChecked = useCallback(() => {
    onAllChecked();
  }, [onAllChecked]);

  useEffect(() => {
    onUncheckAll();
  }, [role, page, onUncheckAll]);

  const content = useMemo(() => {
    return (
      <>
        {role.role && role.role !== undefined ? (
          <TableWrapper>
            <thead>
              <tr className="text-xs xl:text-sm">
                <th>
                  <input
                    className="my-auto checkbox checkbox-sm rounded-md checkbox-primary"
                    type="checkbox"
                    checked={allChecked}
                    onChange={handleAllChecked}
                    disabled={role.role === "everything"}
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
                {role.role == "everything" || role.rank < 3 ? null : (
                  <>
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
                  </>
                )}

                <th>Rôle(s)</th>
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
            <tbody className="text-xs">
              {userList.map((item: any) => (
                <TableRowWrapper key={item._id}>
                  <UserItem
                    role={role}
                    onDelete={onDelete}
                    userItem={item}
                    onRowCheck={onRowCheck}
                    isUserDeleteLoading={isLoading}
                    error={error}
                    sendInvitation={sendInvitation}
                    onToggleStatus={onToggleStatus}
                  />
                </TableRowWrapper>
              ))}
            </tbody>
          </TableWrapper>
        ) : null}
      </>
    );
  }, [
    allChecked,
    handleAllChecked,
    role,
    stype,
    sdir,
    userList,
    onSorting,
    onDelete,
    onRowCheck,
    isLoading,
    error,
    sendInvitation,
    onToggleStatus,
  ]);
  return (
    <div className="flex-1 flex flex-col gap-y-4">
      <>
        {userList.length > 0 ? (
          <>{content}</>
        ) : (
          <ElementNotFound message="Aucun utilisateur trouvé." />
        )}
      </>
    </div>
  );
};

export default UserList;
