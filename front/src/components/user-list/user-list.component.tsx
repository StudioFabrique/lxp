import { FC, useCallback, useContext, useEffect, useState } from "react";
import useHttp from "../../hooks/use-http";
import usePagination from "../../hooks/use-pagination";
import Pagination from "../UI/pagination/pagination";
import UserItem from "./user-item.component";
import RoleSelect from "./roles-select";
import Role from "../../utils/interfaces/role";
import { sortArray } from "../../utils/sortArray";
import { hasPermission } from "../../utils/hasPermission";
import { Context } from "../../store/context.store";
import Can from "../UI/can/can.component";
import Modal from "../UI/modal/modal";

const UserList: FC<{ role: Role }> = ({ role }) => {
  const [userList, setUserList] = useState<any>([]);
  const [stype, setStype] = useState("lastname");
  const [sdir, setSdir] = useState(false);
  const [allChecked, setAllChecked] = useState(false);
  const { sendRequest } = useHttp();
  const { page, perPage, totalPages, setTotalPages, initPagination, setPage } =
    usePagination();
  const { user } = useContext(Context);
  const [showErrorModal, setShowErrorModal] = useState(false);

  console.log(userList);

  const handleSorting = (column: string) => {
    if (column !== stype) {
      setSdir(false);
    } else {
      setSdir((prevSdir) => {
        return !prevSdir;
      });
    }
    setStype(column);
    initPagination();
  };

  const getUserList = useCallback(() => {
    console.log("fetching users list");

    const applyData = (data: any) => {
      let index = (page - 1) * perPage + 1;
      data.users.forEach((item: any) => {
        item.index = index++ + ".";
        item.createdAt =
          item?.createdAt && new Date(item.createdAt).toLocaleDateString();
        item.updatedAt =
          item?.updatedAt && new Date(item.updatedAt).toLocaleDateString();
        item.isSelected = false;
      });
      setTotalPages(data.total);
      setUserList(data.users);
      setAllChecked(false);
    };
    if (role) {
      console.log("role", role.role);

      sendRequest(
        {
          path: `/user/${role.role}/${stype}/${
            sdir ? "desc" : "asc"
          }?page=${page}&limit=${perPage}`,
        },
        applyData
      );
    }
  }, [sendRequest, page, perPage, setTotalPages, role, stype, sdir]);

  useEffect(() => {
    getUserList();
  }, [getUserList]);

  const handleCheckRow = (id: string) => {
    setUserList((prevUserList: any) =>
      prevUserList.map((item: any) =>
        item._id === id ? { ...item, isSelected: !item.isSelected } : item
      )
    );
  };

  const handleAllChecked = () => {
    setAllChecked((prevAllChecked) => {
      return !prevAllChecked;
    });
    setUserList((prevUserList: any) =>
      prevUserList.map((item: any) => ({
        ...item,
        isSelected: !allChecked,
      }))
    );
  };

  const handleRolesChange = (newRoles: Array<Role>, userId: string) => {
    const updatedUserList = userList.map((item: any) =>
      item._id === userId
        ? {
            ...item,
            roles: sortArray(newRoles, "rank"),
          }
        : item
    );
    setUserList(updatedUserList);

    const applyData = (data: any) => {
      console.log(data);
    };
    sendRequest(
      {
        path: `/user/${role.role === "admin" ? "user" : "student"}/${userId}`,
        method: "put",
        body: newRoles,
      },
      applyData
    );
  };

  useEffect(() => {
    initPagination();
    setAllChecked(false);
  }, [role, initPagination]);

  const setErrorModal = () => {
    setShowErrorModal((prevState) => !prevState);
  };

  const handleGroupRolesChange = async (updatedRoles: Array<Role>) => {
    const selectedUserList = userList.filter(
      (user: any) => user.isSelected === true
    );
    const updatedUserList = Array<string>();

    for (const selectedUser of selectedUserList) {
      console.log(selectedUser.roles[0].rank);
      if (
        (await hasPermission("update", updatedRoles[0].role)) &&
        updatedRoles[0].rank >= user!.roles[0].rank &&
        updatedRoles[0].rank === selectedUser!.roles[0].rank &&
        updatedRoles.length > 0
      ) {
        updatedUserList.push(selectedUser._id);
      }
    }
    console.log("longueur", selectedUserList.length);

    console.table(updatedRoles);
    console.table(updatedUserList);

    if (
      selectedUserList.length > updatedUserList.length ||
      updatedRoles.length < 1
    ) {
      setShowErrorModal(true);
      return;
    }

    const updatedRolesIds = updatedRoles.map((role: Role) => role._id);

    const applyData = (data: any) => {
      console.log(data);
      initPagination();
      getUserList();
    };
    if (updatedUserList.length > 0) {
      sendRequest(
        {
          path: `/user/${role.rank < 3 ? "user-roles" : "student-roles"}`,
          method: "put",
          body: { usersToUpdate: updatedUserList, rolesId: updatedRolesIds },
        },
        applyData
      );
    }
  };

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
              handleSorting("lastname");
            }}
          >
            Nom
          </th>
          <th
            className="cursor-pointer"
            onClick={() => {
              handleSorting("firstname");
            }}
          >
            Prénom
          </th>
          <th
            className="cursor-pointer"
            onClick={() => {
              handleSorting("email");
            }}
          >
            Email
          </th>
          <th
            className="cursor-pointer"
            onClick={() => {
              handleSorting("formation");
            }}
          >
            Formation
          </th>
          <th
            className="cursor-pointer"
            onClick={() => {
              handleSorting("isActive");
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
            {
              <UserItem
                userItem={item}
                onRowCheck={handleCheckRow}
                onRolesChange={handleRolesChange}
              />
            }
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="flex flex-col gap-y-4">
      {showErrorModal ? (
        <Modal
          title="Mettre à jour les rôles des utilisateurs sélectionnés"
          message="Un ou plusieurs utilisateurs ne peuvent pas être mis à jour."
          rightLabel="Fermer"
          onRightClick={setErrorModal}
        />
      ) : null}
      <div>
        {role && userList.length > 0 ? (
          <Can action={"update"} subject={role.role}>
            <RoleSelect
              roleTab={role}
              onGroupRolesChange={handleGroupRolesChange}
            />
          </Can>
        ) : null}
      </div>
      <>
        {userList.length > 0 ? (
          <>
            {content}
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </>
        ) : (
          <p>Rien à afficher</p>
        )}
      </>
    </div>
  );
};

export default UserList;
