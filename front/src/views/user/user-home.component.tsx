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
import { useCallback, useContext, useEffect, useState } from "react";
import UserList from "../../components/lists/user-list/user-list.component";
import UserHeader from "../../components/user-header/user-header;component";
import ButtonRefresh from "../../components/UI/button-refresh/button-refresh";
import DropdownActionsUser from "../../components/dropdown-actions-user/dropdown-actions-user";
import { casbinAuthorizer } from "../../config/rbac";

const UserHome = () => {
  const { user, roles } = useContext(Context);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [role, setRole] = useState<Role>(roles[0]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isActionButtonDisabled, setIsActionButtonDisabled] = useState(true);
  const {
    allChecked,
    page,
    totalPages,
    dataList,
    getList,
    sortData,
    initPagination,
    handlePageNumber,
    setPath,
    handleRowCheck,
    setAllChecked,
  } = usePagination("lastname", "/user/everything");
  const { sendRequest } = useHttp();

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
    getList();
  };

  useEffect(() => {
    setRole(roles[0]);
  }, [roles]);

  useEffect(() => {
    if (role) {
      getList();
    }
  }, [page, getList, role]);

  useEffect(() => {
    (async function () {
      if (role) {
        const canUpdate = await casbinAuthorizer.can("update", role.role);
        const canDelete = await casbinAuthorizer.can("delete", role.role);
        setIsActionButtonDisabled(canUpdate && canDelete);
      }
    })();
  }, [role]);

  return (
    <>
      <div className="w-full flex flex-col items-center px-4 py-8 gap-8">
        <UserHeader />
        <div className="flex flex-col gap-y-8">
          {user && role ? (
            <Tabs role={role} roles={roles} onRoleSwitch={handleRoleSwitch} />
          ) : null}
          <div className="flex justify-end items-center">
            {/* <div>
              {role && dataList.length > 0 ? (
                <Can action={"update"} subject={role.role}>
                  <RoleSelect
                    roleTab={role}
                    onGroupRolesChange={handleGroupRolesChange}
                  />
                </Can>
              ) : null}
            </div> */}
            <div className="flex gap-x-2">
              <SearchUser
                options={userSearchOptions}
                onSearch={handleSearchResult}
              />
              <ButtonRefresh size="btn-sm" onRefresh={handleRefreshDataList} />
              {isActionButtonDisabled ? (
                <DropdownActionsUser
                  itemsList={dataList}
                  roleTab={role}
                  onGroupRolesChange={handleGroupRolesChange}
                />
              ) : null}
            </div>
          </div>

          <div className="w-full">
            <UserList
              allChecked={allChecked}
              role={role}
              userList={dataList}
              onRowCheck={handleRowCheck}
              onAllChecked={handleAllChecked}
              onSorting={sortData}
              onUncheckAll={handleUncheckALL}
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
