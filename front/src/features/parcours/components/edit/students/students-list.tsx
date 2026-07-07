/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParcoursSelector, useParcoursDispatch } from "../../../store/ParcoursContext";
import useEagerLoadingList from "../../../../../../src.legacy/hooks/use-eager-loading-list";
import User from "../../../../../../src.legacy/utils/interfaces/user";
import Group from "../../../../../../src.legacy/utils/interfaces/group";
import { useState } from "react";
import Pagination from "../../../../../../src.legacy/components/UI/pagination/pagination";
import Search from "../../../../../../src.legacy/components/UI/search/search.component";
import { userInGroupSearchOptions } from "../../../../../../src.legacy/config/search-options";
import RefreshIcon from "../../../../../../src.legacy/components/UI/svg/refresh-icon.component";
import StudentsListTable from "./students-list-table";
import { UserX } from "lucide-react";

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
  const groups = useParcoursSelector(
    (state) => state.parcoursGroups.groups
  ) as Group[];
  const [filter, setFilter] = useState<string | null>(null);
  const dispatch = useParcoursDispatch();

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
      ? "btn btn-sm btn-outline rounded-full btn-accent"
      : "btn btn-sm btn-outline rounded-full btn-info";
  };

  const removeBtn = (
    <button className="">
      <UserX className="w-4 h-4" />
    </button>
  );

  const handleRemoveGroup = (_id: string) => {
    setFilter(null);
    dispatch({ type: "REMOVE_GROUP", payload: _id });
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
        <div className="flex items-center gap-x-2">
          <h4 className="">Groupes :</h4>
          <ul className="flex gap-x-2">
            {groups.map((group) => (
              <li className={setStyle(group._id!)} key={group._id}>
                <span className="flex items-center gap-x-4">
                  <b onClick={() => handleFilterGroups(group._id!)}>
                    {group.name}
                  </b>
                  <div onClick={() => handleRemoveGroup(group._id!)}>
                    {removeBtn}
                  </div>
                </span>
              </li>
            ))}
          </ul>
        </div>
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
