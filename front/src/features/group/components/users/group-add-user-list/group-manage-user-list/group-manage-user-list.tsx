import { useMemo, useState } from "react";
import type {
  OnChangeFn,
  RowSelectionState,
  SortingState,
  Updater,
} from "@tanstack/react-table";
import { UserPlus } from "lucide-react";
import type User from "../../../../../../utils/interfaces/user";
import RightSideDrawer from "../../../../../../components/UI/right-side-drawer/right-side-drawer";
import SearchBar from "../../../../../../components/UI/search-bar/search-bar";
import { DataTable } from "../../../../../../components/table/DataTable";
import TablePagination from "../../../../../../components/table/TablePagination";
import { useAvailableStudents } from "../../../../hooks/useAvailableStudents";
import { getAvailableStudentColumns } from "../../group-user-table-columns";

type Props = {
  usersToAdd: User[];
  onAddUsers: (users: User[]) => void;
};

const GroupManageUserList = ({ usersToAdd, onAddUsers }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [selectedUsers, setSelectedUsers] = useState<Map<string, User>>(
    new Map(),
  );

  const {
    data,
    isLoading,
    searchValue,
    sortProperty,
    isAscDirection,
    totalItems,
    onSortProperty,
    onSubmitSearchValue,
    onResetPagination,
    ...pagination
  } = useAvailableStudents(
    usersToAdd.map((user) => user._id),
    isOpen,
  );

  const sorting: SortingState = [{ id: sortProperty, desc: !isAscDirection }];

  const handleSortingChange = (updater: Updater<SortingState>) => {
    const nextSorting =
      typeof updater === "function" ? updater(sorting) : updater;
    if (nextSorting[0]) onSortProperty(nextSorting[0].id);
  };

  const handleSelectionChange: OnChangeFn<RowSelectionState> = (updater) => {
    const nextSelection =
      typeof updater === "function" ? updater(rowSelection) : updater;
    setRowSelection(nextSelection);
    setSelectedUsers((currentUsers) => {
      const nextUsers = new Map(currentUsers);
      data.forEach((user) => {
        if (nextSelection[user._id]) nextUsers.set(user._id, user);
        else nextUsers.delete(user._id);
      });
      return nextUsers;
    });
  };

  const resetSelection = () => {
    setRowSelection({});
    setSelectedUsers(new Map());
  };

  const handleClose = () => {
    resetSelection();
    setIsOpen(false);
  };

  const handleAddUsers = () => {
    onAddUsers([...selectedUsers.values()]);
    handleClose();
  };

  const columns = useMemo(() => getAvailableStudentColumns(), []);

  return (
    <>
      <button
        type="button"
        className="btn btn-primary btn-sm whitespace-nowrap"
        onClick={() => {
          onResetPagination();
          setIsOpen(true);
        }}
      >
        <UserPlus className="h-5 w-5" />
        Ajouter des étudiants
      </button>

      <RightSideDrawer
        title="Ajouter des étudiants au groupe"
        id="add-user-to-group"
        visible={false}
        isOpen={isOpen}
        onCloseDrawer={handleClose}
      >
        <div className="flex min-h-full flex-col gap-5">
          {isLoading || data.length > 0 || searchValue ? (
            <SearchBar
              placeholder="Rechercher par nom, prénom ou email"
              onSubmitSearchValue={onSubmitSearchValue}
            />
          ) : null}

          <DataTable
            columns={columns}
            data={data}
            isLoading={isLoading}
            rowSelection={rowSelection}
            setRowSelection={handleSelectionChange}
            sorting={sorting}
            setSorting={handleSortingChange}
            emptyMessage={
              searchValue
                ? "Aucun étudiant disponible pour cette recherche"
                : "Aucun étudiant disponible"
            }
          />

          {data.length > 0 ? (
            <TablePagination
              leftText={`Étudiants disponibles : ${totalItems}`}
              {...pagination}
            />
          ) : null}

          <div className="mt-auto flex items-center justify-between border-t border-base-300 pt-4">
            <span className="text-sm text-base-content/70">
              {selectedUsers.size} étudiant(s) sélectionné(s)
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleClose}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={selectedUsers.size === 0}
                onClick={handleAddUsers}
              >
                Ajouter au groupe
              </button>
            </div>
          </div>
        </div>
      </RightSideDrawer>
    </>
  );
};

export default GroupManageUserList;
