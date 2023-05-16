import { Link } from "react-router-dom";
import UserList from "../../components/user-list/user-list.component";
import { useCallback, useContext, useEffect, useState } from "react";
import { Context } from "../../store/context.store";
import Role from "../../utils/interfaces/role";
import Tabs from "../../components/UI/tabs/tabs.component";
import SearchUser from "../../components/user-list/search-user";
import { userSeachOptions } from "../../config/user-search-options";
import Pagination from "../../components/UI/pagination/pagination";
import usePagination from "../../hooks/use-pagination";
import useHttp from "../../hooks/use-http";
import Can from "../../components/UI/can/can.component";
import RoleSelect from "../../components/user-list/roles-select";
import { hasPermission } from "../../utils/hasPermission";
import Modal from "../../components/UI/modal/modal";

const UserHome = () => {
  const { user, roles } = useContext(Context);
  const [userList, setUserList] = useState<any>([]);
  const [stype, setStype] = useState("lastname");
  const [sdir, setSdir] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const { page, perPage, totalPages, setTotalPages, initPagination, setPage } =
    usePagination();
  const { sendRequest } = useHttp();
  const [role, setRole] = useState<Role>(roles[0]);

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

  const handleRoleSwitch = (role: Role) => {
    setRole(role);
  };

  const handleRowCheck = (id: string) => {
    setUserList((prevUserList: any) =>
      prevUserList.map((item: any) =>
        item._id === id ? { ...item, isSelected: !item.isSelected } : item
      )
    );
  };

  const handleAllChecked = useCallback((value: boolean) => {
    setUserList((prevUserList: any) =>
      prevUserList.map((item: any) => ({
        ...item,
        isSelected: !value,
      }))
    );
  }, []);

  const getUserList = useCallback(() => {
    console.log("hey");

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
    };
    if (role) {
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

  const handleGroupRolesChange = async (updatedRoles: Array<Role>) => {
    const selectedUserList = userList.filter(
      (user: any) => user.isSelected === true
    );
    const updatedUserList = Array<string>();

    for (const selectedUser of selectedUserList) {
      if (
        (await hasPermission("update", updatedRoles[0].role)) &&
        updatedRoles[0].rank >= user!.roles[0].rank &&
        updatedRoles[0].rank === selectedUser!.roles[0].rank &&
        updatedRoles.length > 0
      ) {
        updatedUserList.push(selectedUser._id);
      }
    }
    if (
      selectedUserList.length > updatedUserList.length ||
      updatedRoles.length < 1
    ) {
      setShowErrorModal(true);
      return;
    }

    const updatedRolesIds = updatedRoles.map((role: Role) => role._id);

    const applyData = (data: any) => {
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

  const setErrorModal = () => {
    setShowErrorModal((prevState) => !prevState);
  };

  useEffect(() => {
    setRole(roles[0]);
  }, [roles]);

  useEffect(() => {
    console.log("hello re render");
    getUserList();
  }, [page, getUserList]);

  return (
    <>
      <div className="w-screen flex justify-center my-8">
        <div className="flex flex-col gap-y-4">
          {user && role ? (
            <Tabs role={role} roles={roles} onRoleSwitch={handleRoleSwitch} />
          ) : null}
          <div className="flex justify-between items-center">
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
            <SearchUser options={userSeachOptions} />
          </div>
          <UserList
            role={role}
            userList={userList}
            onRowCheck={handleRowCheck}
            onAllChecked={handleAllChecked}
            onSorting={handleSorting}
          />
          {userList.length > 0 ? (
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          ) : null}
          <Link className="btn" to="/admin/user/add">
            Créer un utilisateur
          </Link>
        </div>
      </div>
      <>
        {showErrorModal ? (
          <Modal
            title="Mettre à jour les rôles des utilisateurs sélectionnés"
            message="Un ou plusieurs utilisateurs ne peuvent pas être mis à jour."
            rightLabel="Fermer"
            onRightClick={setErrorModal}
          />
        ) : null}
      </>
    </>
  );
};

export default UserHome;
