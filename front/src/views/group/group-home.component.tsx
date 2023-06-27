import { Link } from "react-router-dom";
import { useCallback, useContext, useEffect, useState } from "react";
import { Context } from "../../store/context.store";
import Role from "../../utils/interfaces/role";
import Tabs from "../../components/UI/tabs/tabs.component";
import usePagination from "../../hooks/use-pagination";
import useHttp from "../../hooks/use-http";
import { hasPermission } from "../../utils/hasPermission";
import Can from "../../components/UI/can/can.component";
import RoleSelect from "../../components/lists/group-list/roles-select.component";
import { groupSearchOptions } from "../../config/search-options";
import Search from "../../components/UI/search/search.component";
import GroupList from "../../components/lists/group-list/group-list.component";
import Pagination from "../../components/UI/pagination/pagination";
import Modal from "../../components/UI/modal/modal";

const GroupHome = () => {
  const { user, roles } = useContext(Context);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [role, setRole] = useState<Role>(roles[0]);
  const [isSeachActive, setIsSeachActive] = useState(false);

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
  const { sendRequest } = useHttp();

  // const handleAddUsersToGroup = (usersId: string[]) => {
  //   console.log(usersId);
  //   console.log("envoi des données...");
  // };

  const handleSorting = (column: string) => {
    sortData(column);
  };

  const handleRoleSwitch = (role: Role) => {
    initPagination();
    setRole(role);
    setPath(`/group/${role.role}`);
  };
  /* 
  const handleRowCheck = (id: string) => {
    setDataList((prevDataList: any) =>
      prevDataList.map((item: any) =>
        item._id === id ? { ...item, isSelected: !item.isSelected } : item
      )
    );
  }; */

  const handleSearchResult = (entityToSearch: string, searchValue: string) => {
    initPagination();
    setPath(`/group/search/${role.role}/${entityToSearch}/${searchValue}`);
    getList();
    setIsSeachActive(true);
  };

  const handleCloseSearch = () => {
    setIsSeachActive(false);
    initPagination();
    setPath(`/group/${role.role}`);
    getList();
  };

  /*   const handleAllChecked = useCallback(
    (value: boolean) => {
      setDataList((prevDataList: any) =>
        prevDataList.map((item: any) => ({
          ...item,
          isSelected: !value,
        }))
      );
    },
    [setDataList]
  ); */

  const handleAllChecked = () => {
    setAllChecked((prevAllchecked) => !prevAllchecked);
  };

  const handleGroupRolesChange = async (updatedRoles: Array<Role>) => {
    const selectedDataList = dataList.filter(
      (group: any) => group.isSelected === true
    );
    const updatedDataList = Array<string>();

    for (const selectedGroup of selectedDataList) {
      if (
        (await hasPermission("update", updatedRoles[0].role)) &&
        updatedRoles[0].rank >= user!.roles[0].rank &&
        updatedRoles[0].rank === selectedGroup!.roles[0].rank &&
        updatedRoles.length > 0
      ) {
        updatedDataList.push(selectedGroup._id);
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
          path: `/group/${role.rank < 3 ? "user-roles" : "student-roles"}`,
          method: "put",
          body: { groupsToUpdate: updatedDataList, rolesId: updatedRolesIds },
        },
        applyData
      );
    }
  };

  const handleUncheckALL = useCallback(() => {
    setAllChecked(false);
  }, [setAllChecked]);

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
              <Search
                options={groupSearchOptions}
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
          <GroupList
            allChecked={allChecked}
            role={role}
            groupList={dataList}
            onRowCheck={handleRowCheck}
            onAllChecked={handleAllChecked}
            onSorting={handleSorting}
            onUncheckAll={handleUncheckALL}
          />
          {dataList.length > 0 ? (
            <Pagination
              page={page}
              totalPages={totalPages}
              setPage={handlePageNumber}
            />
          ) : null}
          <Link className="btn" to="/admin/group/add">
            Créer un groupe
          </Link>
        </div>
      </div>
      <>
        {showErrorModal ? (
          <Modal
            title="Mettre à jour les rôles des groupes sélectionnés"
            message="Un ou plusieurs groupes ne peuvent pas être mis à jour."
            rightLabel="Fermer"
            onRightClick={setErrorModal}
          />
        ) : null}
      </>
    </>
  );
};

export default GroupHome;
