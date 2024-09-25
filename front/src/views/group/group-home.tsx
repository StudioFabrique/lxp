/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useLocation } from "react-router-dom";
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { Context } from "../../store/context.store";
import Role from "../../utils/interfaces/role";
import Tabs from "../../components/UI/tabs/tabs.component";
import usePagination from "../../hooks/use-pagination";
import { groupSearchOptions } from "../../config/search-options";
import Search from "../../components/UI/search/search.component";
import GroupList from "../../components/lists/group-list/group-list.component";
import Pagination from "../../components/UI/pagination/pagination";
import Modal from "../../components/UI/modal/modal";
import toast from "react-hot-toast";
import EditUsersModal from "../../components/group-home/modals/edit-users/edit-users-modal";
import useHttp from "../../hooks/use-http";
import GroupManageUserList from "../../components/lists/group-add-user-list/group-manage-user-list/group-manage-user-list";
import User from "../../utils/interfaces/user";
import Can from "../../components/UI/can/can.component";

export type GroupModalContent = {
  isModalOpen?: boolean;
  groupId?: string;
  groupName?: string;
  refresh?: boolean;
};

const GroupHome = () => {
  const { user, roles } = useContext(Context);
  const { sendRequest } = useHttp(true);
  const [role, setRole] = useState<Role>(roles[0]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isDrawerActive, setActiveDrawer] = useState(false);

  /**
   * States relatifs aux modals
   */
  const [usersModalContent, setUsersModalContent] = useState<
    GroupModalContent | undefined
  >({ refresh: true });
  const [usersInSelectedGroup, setUsersInSelectedGroup] = useState<User[]>();

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
    setAllChecked,
    handleRowCheck,
  } = usePagination("lastname", `/group/${user!.roles[0].role}`);
  const { state: history } = useLocation();

  const handleSorting = (column: string) => {
    sortData(column);
  };

  const handleRoleSwitch = useCallback(
    (role: Role) => {
      initPagination();
      setRole(role);
      setPath(`/group/${role.role}`);
    },
    [initPagination, setPath],
  );

  const handleSearchResult = (entityToSearch: string, searchValue: string) => {
    initPagination();
    setPath(`/group/search/${role.role}/${entityToSearch}/${searchValue}`);
    getList();
    setIsSearchActive(true);
  };

  const handleCloseSearch = () => {
    setIsSearchActive(false);
    initPagination();
    setPath(`/group/${role.role}`);
    getList();
  };

  const handleAllChecked = () => {
    setAllChecked((prevAllchecked) => !prevAllchecked);
  };

  const handleUncheckALL = useCallback(() => {
    setAllChecked(false);
  }, [setAllChecked]);

  const handleDeleteGroup = (id: string) => {
    const applyData = () => {
      getList();
      toast.success("Groupe supprimé avec succès");
    };

    sendRequest({ path: `/group/${id}`, method: "delete" }, applyData);
  };

  const handleToggleDrawer = () => {
    setActiveDrawer((prevState) => !prevState);
    setUsersModalContent((prevContent) => {
      return { ...prevContent, refresh: true };
    });
  };

  const handleSubmitAddUsers = (users: User[]) => {
    const usersId = users.map((user) => user._id);

    const applyData = () => {
      toast.success("utilisateurs ajoutés avec succès");
      setUsersInSelectedGroup((prevUsers) => {
        if (prevUsers) return [...prevUsers, ...users];
      });
    };

    if (usersModalContent?.groupId)
      sendRequest(
        {
          path: `/group/addUsers/${usersModalContent.groupId}`,
          method: "put",
          body: { usersId },
        },
        applyData,
      );
  };

  useEffect(() => {
    if (history?.toastFrom) {
      toast.success(history.toastFrom);
    }
  }, [history?.toastFrom]);

  useEffect(() => {
    setRole(roles[0]);
  }, [roles]);

  useEffect(() => {
    if (role) {
      getList();
    }
  }, [page, getList, role]);

  useEffect(() => {
    handleRoleSwitch(role);
  }, [handleRoleSwitch, role]);

  return (
    <div className="flex flex-col py-5">
      <div className="my-8 flex justify-center">
        <div className="flex w-[80vw] flex-col gap-y-4">
          <span className="flex justify-between">
            <h2 className="text-4xl font-bold">Liste des groupes</h2>
            <Can action="write" object="group">
              <Link className="btn btn-primary" to="/admin/group/add">
                Créer un groupe
              </Link>
            </Can>
          </span>
          {user && role ? (
            <Tabs role={role} roles={roles} onRoleSwitch={handleRoleSwitch} />
          ) : null}
          <div className="flex items-center justify-end">
            <div className="flex flex-col">
              <Search
                options={groupSearchOptions}
                onSearch={handleSearchResult}
              />
              {isSearchActive ? (
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
          <GroupList
            allChecked={allChecked}
            role={role}
            groupList={dataList}
            onRowCheck={handleRowCheck}
            onAllChecked={handleAllChecked}
            onSorting={handleSorting}
            onUncheckAll={handleUncheckALL}
            onDeleteGroup={handleDeleteGroup}
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
      <>
        {usersModalContent?.isModalOpen ? (
          <Modal
            title=""
            rightLabel="Fermer"
            onRightClick={() =>
              setUsersModalContent((modalContent) => {
                return { ...modalContent, isModalOpen: false };
              })
            }
            modalBoxStyle="max-w-[50%]"
            sendModalBottom={isDrawerActive}
            children={[
              <Fragment key="modal">
                <EditUsersModal
                  modalContent={usersModalContent}
                  setModalContent={setUsersModalContent}
                  onClickAddUsers={handleToggleDrawer}
                  onSetUsersInSelectedGroup={setUsersInSelectedGroup}
                />
              </Fragment>,
            ]}
          />
        ) : null}
        <GroupManageUserList
          onAddUsers={handleSubmitAddUsers}
          usersToAdd={usersInSelectedGroup ?? []}
          drawerOptions={{
            isOpen: isDrawerActive,
            visible: false,
          }}
          onCloseDrawer={handleToggleDrawer}
        />
      </>
    </div>
  );
};

export default GroupHome;
