import { useCallback, useContext, useEffect } from "react";
import { Context } from "../../../store/context.store";

import usePagination from "../../../hooks/use-pagination";
import GroupList from "../../lists/group-list/group-list.component";
import Pagination from "../../UI/pagination/pagination";
import Group from "../../../utils/interfaces/group";
import { useDispatch } from "react-redux";
import { parcoursGroupsAction } from "../../../store/redux-toolkit/parcours/parcours-groups";

interface GroupsListProps {
  onCancel: (id: string) => void;
}

const GroupsList = (props: GroupsListProps) => {
  const { roles } = useContext(Context);
  const dispatch = useDispatch();
  const {
    allChecked,
    page,
    totalPages,
    dataList,
    getList,
    sortData,
    handlePageNumber,
    setAllChecked,
    handleRowCheck,
    uncheckAll,
  } = usePagination("lastname", "/group/student");

  useEffect(() => {
    getList();
  }, [page, getList]);

  const handleAllChecked = () => {
    setAllChecked((prevAllchecked) => !prevAllchecked);
  };

  const handleSorting = (column: string) => {
    sortData(column);
  };

  const handleUncheckALL = useCallback(() => {
    setAllChecked(false);
  }, [setAllChecked]);

  const handleCancel = () => {
    uncheckAll();
    handleUncheckALL();
    props.onCancel("add-group");
  };

  const handleSubmit = () => {
    const updatedGroups = dataList.filter((item: Group) => item.isSelected);
    dispatch(parcoursGroupsAction.setGroups(updatedGroups));
    handleCancel();
  };

  return (
    <article className="flex flex-col gap-y-4">
      <GroupList
        role={roles.find((item) => item.role === "student")!}
        allChecked={allChecked}
        groupList={dataList}
        onRowCheck={handleRowCheck}
        onAllChecked={handleAllChecked}
        onSorting={handleSorting}
        onUncheckAll={handleUncheckALL}
        showActions={false}
      />
      {totalPages && totalPages > 1 ? (
        <Pagination
          page={page}
          totalPages={totalPages}
          setPage={handlePageNumber}
        />
      ) : null}
      <div className="divider" />
      <div className="w-full flex justify-between">
        <button className="btn btn-primary btn-outline" onClick={handleCancel}>
          Annuler
        </button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Valider
        </button>
      </div>
    </article>
  );
};

export default GroupsList;
