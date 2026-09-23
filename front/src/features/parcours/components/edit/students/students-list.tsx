import { useMemo, useState } from "react";
import { Link } from "react-router";
import { Pencil, RefreshCw, Trash2 } from "lucide-react";
import type Group from "../../../../../utils/interfaces/group";
import type { StudentWithGroup } from "../../../hooks/useParcoursStudentsQuery";
import { sortArray } from "../../../../../utils/helpers/sort-array";
import { cn } from "../../../../../utils/cn";
import MultiCriteriaSearch from "../../../../../components/UI/multi-criteria-search";
import TablePagination from "../../../../../components/table/TablePagination";
import { getStoredItemsPerPage, storeItemsPerPage } from "../../../../../components/table/pagination-storage";
import StudentsListTable from "./students-list-table";

interface StudentsListProps {
  initalList: StudentWithGroup[];
  groups: Group[];
  parcoursId: number;
  onRemoveGroup: (groupId: string) => void;
}

const StudentsList = ({ initalList, groups, parcoursId, onRemoveGroup }: StudentsListProps) => {
  const [groupId, setGroupId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(() => getStoredItemsPerPage("parcours-students", 15));
  const [fieldSort, setFieldSort] = useState("lastname");
  const [direction, setDirection] = useState(true);

  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("fr");
    return initalList.filter((student) =>
      (!groupId || student.group?._id === groupId) &&
      (!query || [student.firstname, student.lastname, student.email]
        .some((value) => value?.toLocaleLowerCase("fr").includes(query))),
    );
  }, [initalList, groupId, search]);

  const sorted = useMemo(() => {
    if (fieldSort === "group") {
      return [...filtered].sort((a, b) =>
        (direction ? 1 : -1) * (a.group?.name ?? "").localeCompare(b.group?.name ?? "", "fr"));
    }
    return sortArray(filtered, fieldSort as "firstname" | "lastname" | "email" | "createdAt", direction);
  }, [filtered, fieldSort, direction]);
  const totalPages = Math.max(1, Math.ceil(sorted.length / limit));
  const currentPage = Math.min(page, totalPages);
  const list = sorted.slice((currentPage - 1) * limit, currentPage * limit);

  const sortData = (column: string) => {
    if (column === fieldSort) setDirection((current) => !current);
    else {
      setFieldSort(column);
      setDirection(true);
    }
  };

  const refresh = () => {
    setGroupId(null);
    setSearch("");
    setPage(1);
  };

  return (
    <>
      <div>
        <h4 className="mb-1.5 text-sm font-semibold">Groupes d'apprenants</h4>
        <ul className="flex flex-wrap gap-1.5">
          {groups.map((group) => (
            <li
              className="flex min-w-0 items-center gap-1.5 rounded-md border border-base-300 bg-base-100 p-2"
              key={group._id}
            >
              <button
                type="button"
                className={cn("btn btn-sm h-8 min-h-8 min-w-0 justify-start px-2.5 normal-case", group._id === groupId ? "btn-accent" : "btn-ghost")}
                aria-pressed={group._id === groupId}
                title="Filtrer les apprenants de ce groupe"
                onClick={() => {
                  setGroupId((current) => current === group._id ? null : group._id!);
                  setPage(1);
                }}
              >
                <span className="truncate text-left font-semibold capitalize">{group.name}</span>
              </button>
              <div className="flex shrink-0 items-center gap-1">
                <Link
                  to={`/admin/group/edit/${group._id}?parcours=${parcoursId}`}
                  className="btn btn-sm btn-ghost h-8 min-h-8 gap-1.5 whitespace-nowrap px-2.5 text-primary"
                  aria-label={`Modifier le groupe ${group.name}`}
                >
                  <Pencil className="size-4" /> Modifier
                </Link>
                <button
                  type="button"
                  className="btn btn-sm btn-ghost h-8 min-h-8 gap-1.5 whitespace-nowrap px-2.5 text-error"
                  aria-label={`Détacher le groupe ${group.name}`}
                  onClick={() => {
                    setGroupId(null);
                    setPage(1);
                    onRemoveGroup(group._id!);
                  }}
                >
                  <Trash2 className="size-4" /> Détacher
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full">
        <MultiCriteriaSearch
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Rechercher un apprenant"
          criteria={["prénom", "nom", "email"]}
          actions={
            <button
              type="button"
              onClick={refresh}
              className="btn btn-sm btn-ghost"
              aria-label="Rafraîchir la liste des apprenants"
            >
              <RefreshCw />
            </button>
          }
        />
      </div>

      <div className="w-full">
        <StudentsListTable
          list={list}
          fieldSort={fieldSort}
          direction={direction}
          sortData={sortData}
          emptyMessage={groupId
            ? "Aucun apprenant n’est rattaché à ce groupe."
            : search
              ? "Aucun apprenant disponible pour cette recherche"
              : "Aucun apprenant n’est actuellement rattaché aux groupes sélectionnés."}
        />
      </div>
      {sorted.length > 0 && (
        <div className="mt-5 w-full">
          <TablePagination
            currentPage={currentPage}
            maxPage={totalPages}
            itemsPerPage={limit}
            leftText={`Apprenants : ${sorted.length}`}
            onSetCurrentPage={setPage}
            onSetItemsPerPage={(itemsPerPage) => {
              storeItemsPerPage("parcours-students", itemsPerPage);
              setLimit(itemsPerPage);
              setPage(1);
            }}
            onSetPreviousPage={() => setPage(Math.max(currentPage - 1, 1))}
            onSetNextPage={() => setPage(Math.min(currentPage + 1, totalPages))}
          />
        </div>
      )}
    </>
  );
};

export default StudentsList;
