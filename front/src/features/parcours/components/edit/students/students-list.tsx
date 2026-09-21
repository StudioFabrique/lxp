 
import useEagerLoadingList from "../../../../../../src/hooks/useEagerLoadingList";
import Group from "../../../../../../src/utils/interfaces/group";
import { useState } from "react";
import TablePagination from "../../../../../components/table/TablePagination";
import Search from "../../../../../../src/components/UI/search/search.component";
import { userInGroupSearchOptions } from "../../../../../config/search-options";
import RefreshIcon from "../../../../../../src/components/UI/svg/refresh-icon.component";
import StudentsListTable from "./students-list-table";
import type { StudentWithGroup } from "../../../hooks/useParcoursStudentsQuery";
import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router";

interface StudentsListProps {
  initalList: StudentWithGroup[];
  groups: Group[];
  parcoursId: number;
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
      <article className="flex w-full flex-col gap-4">
        <div>
          <h4 className="mb-1.5 text-sm font-semibold">
            Groupes d'apprenants
          </h4>
          <ul className="flex flex-wrap gap-1.5">
            {groups.map((group) => (
              <li
                className="flex min-w-0 items-center gap-1.5 rounded-md border border-base-300 bg-base-100 p-2"
                key={group._id}
              >
                <button
                  type="button"
                  className={`btn btn-sm h-8 min-h-8 min-w-0 justify-start px-2.5 normal-case ${
                    group._id === filter ? "btn-accent" : "btn-ghost"
                  }`}
                  aria-pressed={group._id === filter}
                  title="Filtrer les apprenants de ce groupe"
                  onClick={() => handleFilterGroups(group._id!)}
                >
                  <span className="truncate text-left font-semibold capitalize">
                    {group.name}
                  </span>
                </button>
                <div className="flex shrink-0 items-center gap-1">
                  <Link
                    to={`/admin/group/edit/${group._id}?parcours=${props.parcoursId}`}
                    className="btn btn-sm btn-ghost h-8 min-h-8 gap-1.5 whitespace-nowrap px-2.5 text-primary"
                    aria-label={`Modifier le groupe ${group.name}`}
                  >
                    <Pencil className="size-4" />
                    Modifier
                  </Link>
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost h-8 min-h-8 gap-1.5 whitespace-nowrap px-2.5 text-error"
                    aria-label={`Détacher le groupe ${group.name}`}
                    onClick={() => handleRemoveGroup(group._id!)}
                  >
                    <Trash2 className="size-4" />
                    Détacher
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center justify-end gap-x-2">
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
        <p className="py-6 text-center text-sm text-base-content/60">
          {filter
            ? "Aucun apprenant n’est rattaché à ce groupe."
            : "Aucun apprenant n’est actuellement rattaché aux groupes sélectionnés."}
        </p>
      )}
    </>
  );
};

export default StudentsList;
