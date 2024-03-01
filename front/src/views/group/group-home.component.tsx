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
import EditUsersModal from "../../components/group-home/modals/edit-users-modal";
import User from "../../utils/interfaces/user";
import useHttp from "../../hooks/use-http";

export type EditUsersModalContent = {
  isModalOpen: boolean;
  groupId?: string;
  users?: User[];
};

const GroupHome = () => {
  const { sendRequest } = useHttp(true);
  const { user, roles } = useContext(Context);

  const [modalContent, setModalContent] = useState<EditUsersModalContent>();
  const [role, setRole] = useState<Role>(roles[0]);
  const [isSearchActive, setIsSearchActive] = useState(false);

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
    [initPagination, setPath]
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

  /**
   * UseEffect implémenté dans le cadre de la modal, à chaque fois que l'id
   * de groupe du state modalContent change, alors effectué une requête des
   * utilisateur du nouveau groupe selectionné.
   */
  useEffect(() => {
    const applyData = () => {};

    if (modalContent?.isModalOpen && modalContent?.groupId)
      sendRequest(
        {
          path: `group/${modalContent.groupId}`,
          method: "put",
          body: {},
        },
        applyData
      );
  }, [modalContent?.groupId, modalContent?.isModalOpen, sendRequest]);

  return (
    <div className="flex flex-col py-5">
      <div className="flex justify-center my-8">
        <div className="flex flex-col gap-y-4">
          <span className="flex justify-between">
            <h2 className="text-4xl font-bold">Liste des groupes</h2>
            <Link className="btn btn-primary" to="/admin/group/add">
              Créer un groupe
            </Link>
          </span>
          {user && role ? (
            <Tabs role={role} roles={roles} onRoleSwitch={handleRoleSwitch} />
          ) : null}
          <div className="flex justify-end items-center">
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
            onSetModalContent={setModalContent}
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
        {modalContent?.isModalOpen ? (
          <Modal
            title="Mettre à jour les utilisateurs du groupe"
            rightLabel="Fermer"
            onRightClick={() =>
              setModalContent((modalContent) => {
                return { ...modalContent, isModalOpen: false };
              })
            }
            children={[<Fragment key="modal">{EditUsersModal()}</Fragment>]}
          />
        ) : null}
      </>
    </div>
  );
};

export default GroupHome;
