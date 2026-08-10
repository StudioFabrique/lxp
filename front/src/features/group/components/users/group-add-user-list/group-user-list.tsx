import { useCallback, useMemo, useState } from "react";
import type { RowSelectionState, SortingState } from "@tanstack/react-table";
import { Trash2, UserRoundPlus } from "lucide-react";
import type User from "../../../../../utils/interfaces/user";
import Wrapper from "../../../../../components/wrappers/BoxWrapper";
import SearchBar from "../../../../../components/UI/search-bar/search-bar";
import PermissionGuard from "../../../../../components/guards/PermissionGuard";
import { DataTable } from "../../../../../components/table/DataTable";
import TablePagination from "../../../../../components/table/TablePagination";
import GroupManageUserList from "./group-manage-user-list/group-manage-user-list";
import CsvImportUserList from "./csv-import-user/csv-import-user-list/csv-import-user-list.component";
import { getGroupStudentColumns } from "../group-user-table-columns";

const compareValues = (left: unknown, right: unknown) =>
  String(left ?? "").localeCompare(String(right ?? ""), "fr", {
    sensitivity: "base",
  });

type Props = {
  usersToAdd: User[];
  onAddUsers: (users: User[]) => void;
  onDeleteUser: (user: User) => void;
  onCreateStudent: () => void;
};

const GroupUserList = ({
  usersToAdd,
  onAddUsers,
  onDeleteUser,
  onCreateStudent,
}: Props) => {
  const [filter, setFilter] = useState<string>();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([
    { id: "lastname", desc: false },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    const storedValue = localStorage.getItem("itemsPerPage");
    return storedValue ? Number(storedValue) : 10;
  });

  const filteredUsers = useMemo(() => {
    const searchValue = filter?.trim().toLocaleLowerCase("fr");
    if (!searchValue) return usersToAdd;
    return usersToAdd.filter((user) =>
      [user.firstname, user.lastname, user.email].some((value) =>
        value?.toLocaleLowerCase("fr").includes(searchValue),
      ),
    );
  }, [filter, usersToAdd]);

  const sortedUsers = useMemo(() => {
    const currentSorting = sorting[0];
    if (!currentSorting) return filteredUsers;
    return [...filteredUsers].sort((left, right) => {
      const result = compareValues(
        left[currentSorting.id as keyof User],
        right[currentSorting.id as keyof User],
      );
      return currentSorting.desc ? -result : result;
    });
  }, [filteredUsers, sorting]);

  const maxPage = Math.max(1, Math.ceil(sortedUsers.length / itemsPerPage));
  const displayedPage = Math.min(currentPage, maxPage);
  const displayedUsers = useMemo(() => {
    const start = (displayedPage - 1) * itemsPerPage;
    return sortedUsers.slice(start, start + itemsPerPage);
  }, [displayedPage, itemsPerPage, sortedUsers]);

  const selectedUserIds = Object.keys(rowSelection).filter((userId) =>
    usersToAdd.some((user) => user._id === userId && rowSelection[userId]),
  );

  const handleDeleteUser = useCallback(
    (user: User) => {
      onDeleteUser(user);
      setRowSelection((selection) => {
        const nextSelection = { ...selection };
        delete nextSelection[user._id];
        return nextSelection;
      });
    },
    [onDeleteUser],
  );

  const handleDeleteSelectedUsers = () => {
    usersToAdd
      .filter((user) => selectedUserIds.includes(user._id))
      .forEach(onDeleteUser);
    setRowSelection({});
  };

  const handleSetItemsPerPage = (value: number) => {
    localStorage.setItem("itemsPerPage", String(value));
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const columns = useMemo(
    () => getGroupStudentColumns({ onDeleteUser: handleDeleteUser }),
    [handleDeleteUser],
  );

  return (
    <Wrapper additionalClassname="px-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">Étudiants</h2>
          <p className="text-sm text-base-content/65">
            {usersToAdd.length} étudiant(s) dans le groupe
          </p>
        </div>

        <div className="flex flex-nowrap items-center justify-end gap-2">
          <GroupManageUserList
            onAddUsers={onAddUsers}
            usersToAdd={usersToAdd}
          />
          <PermissionGuard object="user" action="write">
            <button
              type="button"
              className="btn btn-outline btn-sm btn-primary whitespace-nowrap"
              onClick={onCreateStudent}
            >
              <UserRoundPlus className="h-5 w-5" />
              Créer un nouvel étudiant
            </button>
          </PermissionGuard>
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-base-content/30 p-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-2">
          <CsvImportUserList
            onAddUsers={onAddUsers}
            usersAddedInTable={usersToAdd}
          />
        </div>

        <div className="min-w-0 flex-1 xl:max-w-2xl">
          <SearchBar
            placeholder="Rechercher un étudiant par nom, prénom ou email"
            onSetFilter={setFilter}
          >
            {selectedUserIds.length > 0 && (
              <button
                type="button"
                className="btn btn-ghost btn-sm whitespace-nowrap text-error"
                onClick={handleDeleteSelectedUsers}
              >
                <Trash2 className="h-4 w-4" />
                Retirer la sélection
              </button>
            )}
          </SearchBar>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={displayedUsers}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        sorting={sorting}
        setSorting={setSorting}
        emptyMessage={
          filter
            ? "Aucun étudiant ne correspond à la recherche"
            : "Aucun étudiant dans ce groupe"
        }
      />

      <TablePagination
        currentPage={displayedPage}
        maxPage={maxPage}
        itemsPerPage={itemsPerPage}
        leftText={`Étudiants : ${filteredUsers.length}`}
        onSetCurrentPage={setCurrentPage}
        onSetItemsPerPage={handleSetItemsPerPage}
        onSetPreviousPage={() =>
          setCurrentPage((page) => Math.max(page - 1, 1))
        }
        onSetNextPage={() =>
          setCurrentPage((page) => Math.min(page + 1, maxPage))
        }
      />
    </Wrapper>
  );
};

export default GroupUserList;
