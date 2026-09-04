 
import useEagerLoadingList from "../../../../../../src/hooks/useEagerLoadingList";
import Group from "../../../../../../src/utils/interfaces/group";
import { useState } from "react";
import TablePagination from "../../../../../components/table/TablePagination";
import Search from "../../../../../../src/components/UI/search/search.component";
import { userInGroupSearchOptions } from "../../../../../config/search-options";
import RefreshIcon from "../../../../../../src/components/UI/svg/refresh-icon.component";
import StudentsListTable from "./students-list-table";
import type { StudentWithGroup } from "../../../hooks/useParcoursStudentsQuery";
import { UserX } from "lucide-react";

interface StudentsListProps {
  initalList: StudentWithGroup[];
  groups: Group[];
  onRemoveGroup: (groupId: string) => void;
}

const StudentsList = (props: StudentsListProps) => {
  const {
    list,
    limit,
    page,
    fieldSort,
    direction,
    totalPages,
    setPage,
    setLimit,
    getFilteredList,
    resetFilters,
    sortData,
  } = useEagerLoadingList(
    props.initalList,
    "lastname",
    15,
    "id",
    "parcours-students",
  );
  const groups = props.groups;
  const [filter, setFilter] = useState<string | null>(null);

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
    props.onRemoveGroup(_id);
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
            <TablePagination
              currentPage={page}
              maxPage={totalPages}
              itemsPerPage={limit}
              leftText={`Apprenants : ${props.initalList.length}`}
              onSetCurrentPage={setPage}
              onSetItemsPerPage={(itemsPerPage) => {
                setLimit(itemsPerPage);
                setPage(1);
              }}
              onSetPreviousPage={() =>
                setPage((current) => Math.max(current - 1, 1))
              }
              onSetNextPage={() =>
                setPage((current) => Math.min(current + 1, totalPages))
              }
            />
          </article>
        </>
      ) : (
        <p>Les groupes choisis sont vides.</p>
      )}
    </>
  );
};

export default StudentsList;
