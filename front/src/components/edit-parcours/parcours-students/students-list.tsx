import { useSelector } from "react-redux";
import useEagerLoadingList from "../../../hooks/use-eager-loading-list";
import User from "../../../utils/interfaces/user";
import Group from "../../../utils/interfaces/group";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { parcoursGroupsAction } from "../../../store/redux-toolkit/parcours/parcours-groups";
import Pagination from "../../UI/pagination/pagination";
import Search from "../../UI/search/search.component";
import { userInGroupSearchOptions } from "../../../config/search-options";
import RefreshIcon from "../../UI/svg/refresh-icon.component";
import StudentsListTable from "./students-list-table";

interface StudentsListProps {
  initalList: User[];
}

const StudentsList = (props: StudentsListProps) => {
  const {
    list,
    page,
    fieldSort,
    direction,
    totalPages,
    setPage,
    getFilteredList,
    resetFilters,
    sortData,
  } = useEagerLoadingList(props.initalList, "lastname");
  const groups = useSelector(
    (state: any) => state.parcoursGroups.groups
  ) as Group[];
  const [filter, setFilter] = useState<string | null>(null);
  const dispatch = useDispatch();

  const handleFilterGroups = (_id: string) => {
    if (filter === _id) {
      resetFilters();
      setFilter(null);
    } else {
      setFilter(_id);
      getFilteredList({ field: "group", property: "_id", value: _id });
    }
  };

  const setStyle = (_id: string) => {
    return _id === filter
      ? "btn btn-sm rounded-full btn-accent"
      : "btn btn-sm rounded-full btn-info";
  };

  const removeBtn = (
    <button className="btn btn-xs btn-error btn-circle lowercase">x</button>
  );

  const handleRemoveGroup = (_id: string) => {
    setFilter(null);
    dispatch(parcoursGroupsAction.removeGroup(_id));
  };

  const handleSearch = (field: string, value: string) => {
    getFilteredList({ field, property: "", value });
  };

  const handleRefreshList = () => {
    resetFilters();
    setFilter(null);
  };

  return (
    <>
      <article className="w-full flex justify-between items-center">
        <ul className="flex gap-x-2">
          {groups.map((group) => (
            <li className={setStyle(group._id!)} key={group._id}>
              <span className="flex items-center gap-x-4">
                <p onClick={() => handleFilterGroups(group._id!)}>
                  {group.name}
                </p>
                <div onClick={() => handleRemoveGroup(group._id!)}>
                  {removeBtn}
                </div>
              </span>
            </li>
          ))}
        </ul>
        <div className="flex gap-x-2 items-center">
          <Search options={userInGroupSearchOptions} onSearch={handleSearch} />
          <div
            className="text-primary cursor-pointer"
            onClick={handleRefreshList}
          >
            <RefreshIcon size={6} />
          </div>
        </div>
      </article>

      {list && list.length > 0 ? (
        <>
          <article>
            <StudentsListTable
              list={list}
              fieldSort={fieldSort}
              direction={direction}
              sortData={sortData}
            />
          </article>
          <article>
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </article>
        </>
      ) : (
        <p>Les groupes choisis sont vides.</p>
      )}
    </>
  );
};

export default StudentsList;
