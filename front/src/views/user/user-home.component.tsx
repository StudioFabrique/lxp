import { Link } from "react-router-dom";
import { Context } from "../../store/context.store";
import Role from "../../utils/interfaces/role";
import Tabs from "../../components/UI/tabs/tabs.component";
import SearchUser from "../../components/UI/search/search.component";
import { userSeachOptions } from "../../config/search-options";
import Pagination from "../../components/UI/pagination/pagination";
import usePagination from "../../hooks/use-pagination";
import useHttp from "../../hooks/use-http";
import Can from "../../components/UI/can/can.component";
import RoleSelect from "../../components/lists/user-list/roles-select.component";
import { hasPermission } from "../../utils/hasPermission";
import Modal from "../../components/UI/modal/modal";
import { useCallback, useContext, useEffect, useState } from "react";
import UserList from "../../components/lists/user-list/user-list.component";

const UserHome = () => {
  const { user, roles } = useContext(Context);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [role, setRole] = useState<Role>(roles[0]);
  const [isSeachActive, setIsSeachActive] = useState(false);
  const {
    page,
    totalPages,
    dataList,
    getList,
    sortData,
    initPagination,
    handlePageNumber,
    setDataList,
    setPath,
  } = usePagination("lastname", `/user/${user!.roles[0].role}`);
  const { sendRequest } = useHttp();

  const handleSorting = (column: string) => {
    sortData(column);
  };

  const handleRoleSwitch = (role: Role) => {
    initPagination();
    setRole(role);
    setIsSeachActive(false);
    setPath(`/user/${role.role}`);
  };

  const handleRowCheck = (id: string) => {
    setDataList((prevDataList: any) =>
      prevDataList.map((item: any) =>
        item._id === id ? { ...item, isSelected: !item.isSelected } : item
      )
    );
  };

  const handleSearchResult = (entityToSearch: string, searchValue: string) => {
    initPagination();
    setPath(`/user/search/${role.role}/${entityToSearch}/${searchValue}`);
    getList();
    setIsSeachActive(true);
  };

  const handleCloseSearch = () => {
    setIsSeachActive(false);
    initPagination();
    setPath(`/user/${role.role}`);
    getList();
  };

  const handleAllChecked = useCallback(
    (value: boolean) => {
      setDataList((prevDataList: any) =>
        prevDataList.map((item: any) => ({
          ...item,
          isSelected: !value,
        }))
      );
    },
    [setDataList]
  );

  const handleGroupRolesChange = async (updatedRoles: Array<Role>) => {
    const selectedDataList = dataList.filter(
      (user: any) => user.isSelected === true
    );
    const updatedDataList = Array<string>();

    for (const selectedUser of selectedDataList) {
      if (
        (await hasPermission("update", updatedRoles[0].role)) &&
        updatedRoles[0].rank >= user!.roles[0].rank &&
        updatedRoles[0].rank === selectedUser!.roles[0].rank &&
        updatedRoles.length > 0
      ) {
        updatedDataList.push(selectedUser._id);
      }
    }
    if (
      selectedDataList.length > updatedDataList.length ||
      updatedRoles.length < 1
    ) {
      setShowErrorModal(true);
      return;
    }

    const updatedRolesIds = updatedRoles.map((role: Role) => role._id);

    const applyData = (data: any) => {
      initPagination();
      getList();
    };
    if (updatedDataList.length > 0) {
      sendRequest(
        {
          path: `/user/${role.rank < 3 ? "user-roles" : "student-roles"}`,
          method: "put",
          body: { usersToUpdate: updatedDataList, rolesId: updatedRolesIds },
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
    if (role) {
      getList();
    }
  }, [page, getList, role]);

  return (
    <>
      <div className="w-screen flex justify-center my-8">
        <div className="flex flex-col gap-y-4">
          {user && role ? (
            <Tabs role={role} roles={roles} onRoleSwitch={handleRoleSwitch} />
          ) : null}
          <div className="flex justify-between items-center">
            <div>
              {role && dataList.length > 0 ? (
                <Can action={"update"} subject={role.role}>
                  <RoleSelect
                    roleTab={role}
                    onGroupRolesChange={handleGroupRolesChange}
                  />
                </Can>
              ) : null}
            </div>
            <div className="flex flex-col">
              <SearchUser
                options={userSeachOptions}
                onSearch={handleSearchResult}
              />
              {isSeachActive ? (
                <div className="flex justify-end">
                  <button
                    className="btn btn-info btn-sm"
                    onClick={handleCloseSearch}
                  >
                    Fermer la recherche
                  </button>
                </div>
              ) : null}
            </div>
          </div>
          <UserList
            role={role}
            userList={dataList}
            onRowCheck={handleRowCheck}
            onAllChecked={handleAllChecked}
            onSorting={handleSorting}
          />
          {dataList.length > 0 ? (
            <Pagination
              page={page}
              totalPages={totalPages}
              setPage={handlePageNumber}
            />
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
