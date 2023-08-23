import { useCallback, useContext, useEffect, useState } from "react";
import { Context } from "../../store/context.store";

import Role from "../../utils/interfaces/role";
import Tabs from "../../components/UI/tabs/tabs.component";
import SearchUser from "../../components/UI/search/search.component";
import { userSearchOptions } from "../../config/search-options";
import Pagination from "../../components/UI/pagination/pagination";
import usePagination from "../../hooks/use-pagination";
import useHttp from "../../hooks/use-http";
import { hasPermission } from "../../utils/hasPermission";
import Modal from "../../components/UI/modal/modal";
import UserList from "../../components/lists/user-list/user-list.component";
import UserHeader from "../../components/user-header/user-header;component";
import DropdownActionsUser from "../../components/lists/user-list/dropdown-actions-user";
import UsersListStats from "../../components/lists/user-list/users-list-stats";
import UsersStats from "../../utils/interfaces/users-stats";
import Can from "../../components/UI/can/can.component";
import RefreshIcon from "../../components/UI/svg/refresh-icon.component";

const UserHome = () => {
  const { user, roles } = useContext(Context);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [role, setRole] = useState<Role>(roles[0]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [stats, setStats] = useState<Array<UsersStats> | null>(null);
  const {
    allChecked,
    page,
    totalPages,
    dataList,
    stype,
    sdir,
    getList,
    sortData,
    initPagination,
    handlePageNumber,
    setPath,
    handleRowCheck,
    setAllChecked,
    setDataList,
  } = usePagination("lastname", "/user/everything");
  const { isLoading, sendRequest, error } = useHttp();

  const handleRoleSwitch = (role: Role) => {
    initPagination();
    if (isSearchActive) {
      handleCloseSearch();
    }
    setRole(role);
    setIsSearchActive(false);
    setPath(`/user/${role.role}`);
  };

  const handleAllChecked = () => {
    setAllChecked((prevAllchecked) => !prevAllchecked);
  };

  const handleUncheckALL = useCallback(() => {
    setAllChecked(false);
  }, [setAllChecked]);

  const handleSearchResult = (entityToSearch: string, searchValue: string) => {
    initPagination();
    setPath(`/user/search/${role.role}/${entityToSearch}/${searchValue}`);
    getList();
    setIsSearchActive(true);
  };

  const handleCloseSearch = () => {};

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
      handleUncheckALL();
    };
    if (updatedDataList.length > 0) {
      sendRequest(
        {
          path: "/user/user-roles",
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

  const handleRefreshDataList = () => {
    setIsSearchActive(false);
    setPath(`/user/${role.role}`);
    handleUncheckALL();
    getList();
    handleGetUsersStats();
  };

  useEffect(() => {
    setRole(roles[0]);
  }, [roles]);

  useEffect(() => {
    if (role) {
      getList();
    }
  }, [page, getList, role]);

  const handleGetUsersStats = useCallback(() => {
    const applyData = (data: Array<UsersStats>) => {
      setStats(data);
    };
    sendRequest(
      {
        path: "/user/stats",
      },
      applyData
    );
  }, [sendRequest]);

  useEffect(() => {
    handleGetUsersStats();
  }, [handleGetUsersStats]);

  const handleUpdateManyStatus = (value: string) => {
    const applyData = (data: any) => {
      handleRefreshDataList();
    };
    const usersToUpdate = dataList.filter((item) => item.isSelected);
    const usersIds = usersToUpdate.map((item) => item._id);
    sendRequest(
      {
        path: "/user/update-many-status",
        method: "put",
        body: { usersIds, status: value },
      },
      applyData
    );
  };

  const handleDeleteUser = (id: string) => {
    sendRequest(
      {
        path: "/user",
        method: "delete",
        body: { id },
      },
      (data) => {
        if (!data || error) {
          return;
        }

        const dataToChange = dataList.filter((user) => user._id !== id);
        setDataList(dataToChange);
      }
    );
  };

  return (
    <>
      <div className="w-full flex flex-col items-center px-4 py-8 gap-8">
        <UserHeader />

        <UsersListStats stats={stats} isLoading={isLoading} />
        <div className="flex flex-col gap-y-8">
          {user && role ? (
            <Tabs role={role} roles={roles} onRoleSwitch={handleRoleSwitch} />
          ) : null}
          <div className="flex justify-end items-center">
            <div className="flex items-center gap-x-2">
              <SearchUser
                options={userSearchOptions}
                onSearch={handleSearchResult}
              />
              <div className="text-primary" onClick={handleRefreshDataList}>
                <RefreshIcon size={6} />
              </div>
              {!role ? null : (
                <Can action="update" subject={role.role}>
                  <DropdownActionsUser
                    itemsList={dataList}
                    roleTab={role}
                    onGroupRolesChange={handleGroupRolesChange}
                    onUpdateManyStatus={handleUpdateManyStatus}
                  />
                </Can>
              )}
            </div>
          </div>
          <div className="w-full">
            <UserList
              isLoading={isLoading}
              allChecked={allChecked}
              page={page}
              role={role}
              userList={dataList}
              onRowCheck={handleRowCheck}
              onAllChecked={handleAllChecked}
              onSorting={sortData}
              onUncheckAll={handleUncheckALL}
              sdir={sdir}
              stype={stype}
              onDelete={handleDeleteUser}
              error={error}
            />
            {dataList.length > 0 ? (
              <Pagination
                page={page}
                totalPages={totalPages}
                setPage={handlePageNumber}
              />
            ) : null}
          </div>
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
