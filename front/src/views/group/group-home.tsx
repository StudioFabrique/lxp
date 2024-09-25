/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useLocation } from "react-router-dom";
import { useCallback, useContext, useEffect, useState } from "react";
import { Context } from "../../store/context.store";
import Role from "../../utils/interfaces/role";
import Tabs from "../../components/UI/tabs/tabs.component";
import usePagination from "../../hooks/use-pagination";
import { groupSearchOptions } from "../../config/search-options";
import Search from "../../components/UI/search/search.component";
import GroupList from "../../components/lists/group-list/group-list.component";
import Pagination from "../../components/UI/pagination/pagination";
import toast from "react-hot-toast";
import useHttp from "../../hooks/use-http";
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
  };

  const handleAllChecked = () => {
    setAllChecked((prevAllchecked) => !prevAllchecked);
  };

  const handleUncheckAll = useCallback(() => {
    setAllChecked(false);
  }, [setAllChecked]);

  const handleDeleteGroup = async (id: string) => {
    const applyData = () => {
      getList();
      toast.success("Groupe supprimé avec succès");
    };

    await sendRequest({ path: `/group/${id}`, method: "delete" }, applyData);

    return true;
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
            </div>
          </div>
          <GroupList
            allChecked={allChecked}
            role={role}
            groupList={dataList}
            onRowCheck={handleRowCheck}
            onAllChecked={handleAllChecked}
            onSorting={handleSorting}
            onUncheckAll={handleUncheckAll}
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
    </div>
  );
};

export default GroupHome;
