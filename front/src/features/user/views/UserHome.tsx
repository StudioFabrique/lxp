import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  RowSelectionState,
  SortingState,
  Updater,
} from "@tanstack/react-table";
import { PlusCircle, RefreshCw } from "lucide-react";

import { AuthContext } from "../../../store/AuthProvider";
import type Role from "../../../utils/interfaces/role";
import type User from "../../../utils/interfaces/user";
import { useUserActions } from "../hooks/useUserActions";
import { useUserList } from "../hooks/useUserList";
import {
  canManageUser,
  getUsersColumns,
} from "../components/user-table-columns";
import UserStats from "../components/user-data/UserStats";

import PageHeader from "../../../components/headers/PageHeader";
import PermissionGuard from "../../../components/guards/PermissionGuard";
import Wrapper from "../../../../src/components/wrappers/BoxWrapper";
import { DataTable } from "../../../components/table/DataTable";
import TablePagination from "../../../components/table/TablePagination";
import TableActionsModal from "../../../components/table/TableActionsModal";
import TableActionsButtons from "../../../components/table/TableActionsButtons";
import SearchBar from "../../../components/UI/search-bar/search-bar";
import { usersPageTourSteps } from "../../../components/headers/page-tour-steps";

const UserHome = () => {
  const { roles, user: currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const currentUserRank = useMemo(
    () =>
      currentUser
        ? Math.min(...currentUser.roles.map(({ rank }) => rank), 4)
        : undefined,
    [currentUser],
  );

  const [currentRole, setCurrentRole] = useState<Role | null>(null);

  const {
    data,
    isLoading,
    searchValue,
    totalItems,
    sortProperty,
    isAscDirection,
    stats,
    onRefreshData,
    onSubmitSearchValue,
    onSortProperty,
    ...pagination
  } = useUserList(currentRole);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const selectedIds = Object.keys(rowSelection);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [idToResetPassword, setIdToResetPassword] = useState<string | null>(
    null,
  );
  const [idToResendInvitation, setIdToResendInvitation] = useState<
    string | null
  >(null);

  const refreshAndClearSelection = useCallback(() => {
    setRowSelection({});
    onRefreshData();
  }, [onRefreshData]);

  const {
    onDeleteOne,
    onDeleteSelected,
    onSendInvitation,
    onSendResetPassword,
    isDeleting,
    deleteError,
    resetDeleteError,
  } = useUserActions(refreshAndClearSelection);

  const userToDelete = useMemo(
    () => data.find((u) => u._id === idToDelete),
    [data, idToDelete],
  );

  const userToResetPassword = useMemo(
    () => data.find((u) => u._id === idToResetPassword),
    [data, idToResetPassword],
  );

  const userToResendInvitation = useMemo(
    () => data.find((u) => u._id === idToResendInvitation),
    [data, idToResendInvitation],
  );

  const sorting: SortingState = sortProperty
    ? [{ id: sortProperty, desc: !isAscDirection }]
    : [];

  const handleSortingChange = (updater: Updater<SortingState>) => {
    const newSorting =
      typeof updater === "function" ? updater(sorting) : updater;
    if (newSorting.length > 0) onSortProperty(newSorting[0].id);
  };

  const columns = useMemo(
    () =>
      getUsersColumns(
        (id) => {
          resetDeleteError();
          setIdToDelete(id);
        },
        (id) => setIdToResendInvitation(id),
        (id) => setIdToResetPassword(id),
        currentUser?._id,
        currentUserRank,
      ),
    [currentUser?._id, currentUserRank, resetDeleteError],
  );

  const selectedUserNames = useCallback(
    () =>
      data
        .filter((user) => user._id && rowSelection[user._id])
        .map((user) => `${user.firstname} ${user.lastname}`),
    [data, rowSelection],
  );

  const handleConfirmSingleDelete = async () => {
    if (idToDelete) {
      try {
        await onDeleteOne(idToDelete);
        setIdToDelete(null);
      } catch {
        // Le toast et le message de la modale sont alimentés par la mutation.
      }
    }
  };

  const handleCancelSingleDelete = () => {
    setIdToDelete(null);
    resetDeleteError();
  };

  const deleteWarning = useMemo(() => {
    if (!userToDelete) return undefined;

    if (userToDelete.roles.some((role) => role.rank === 3)) {
      return "Ses accomplissements, résultats de quiz et historiques de progression seront également supprimés.";
    }

    if (userToDelete.roles.some((role) => role.rank === 2)) {
      return "L'utilisateur sera détaché de ses parcours, modules et cours. Les contenus qu'il a créés seront conservés et transférés.";
    }

    if (userToDelete.roles.some((role) => role.rank === 1)) {
      return "Les contenus créés par cet administrateur seront conservés et transférés.";
    }

    return undefined;
  }, [userToDelete]);

  const handleConfirmResetPassword = async () => {
    if (idToResetPassword) {
      onSendResetPassword(idToResetPassword);
      setIdToResetPassword(null);
    }
  };

  const handleConfirmResendInvitation = async () => {
    if (idToResendInvitation) {
      onSendInvitation(idToResendInvitation);
      setIdToResendInvitation(null);
    }
  };

  // Les statistiques n'existent que pour les étudiants : les autres lignes
  // n'ouvrent rien.
  const isStudent = useCallback(
    (user: User) => user.roles.some((role) => role.rank === 3),
    [],
  );

  const handleRowClick = useCallback(
    (user: User) => {
      if (!user._id || !isStudent(user)) return;
      navigate(`/admin/user/data/${user._id}`);
    },
    [isStudent, navigate],
  );

  const handleRoleSwitch = (role: Role) => {
    setRowSelection({});
    setCurrentRole(role);
  };

  useEffect(() => {
    if (roles.length > 0 && !currentRole) {
      setCurrentRole(roles[0]);
    }
  }, [roles, currentRole]);

  return (
    <div>
      <PageHeader
        title="Liste d'utilisateurs"
        description="Créez, modifiez et supprimez des comptes, assignez des rôles et des permissions, et mettez à jour vos utilisateurs"
        tourSteps={usersPageTourSteps}
      >
        <PermissionGuard object="user" action="write">
          <Link className="btn btn-primary btn-soft" to="/admin/user/add">
            <PlusCircle className="mr-2 h-5 w-5" />
            Créer un utilisateur
          </Link>
        </PermissionGuard>
      </PageHeader>

      <div data-page-tour="stats">
        <UserStats stats={stats} />
      </div>

      {roles.length > 0 && currentRole ? (
        <div
          className="mb-4 flex w-full flex-wrap justify-start gap-2"
          data-page-tour="role-filters"
        >
          {roles.map((role) => (
            <button
              key={role._id}
              type="button"
              onClick={() => handleRoleSwitch(role)}
              className={`btn btn-sm ${
                currentRole._id === role._id
                  ? "btn-primary"
                  : "btn-outline btn-primary"
              }`}
            >
              {role.label}
            </button>
          ))}
        </div>
      ) : null}

      <Wrapper
        additionalClassname={`${data.length > 0 || isLoading ? "px-10" : ""} items-center`}
        unstyled={!isLoading && data.length === 0}
      >
        {isLoading || data.length > 0 || searchValue ? (
          <div className="w-full" data-page-tour="filters">
            <SearchBar
              placeholder="Rechercher un utilisateur"
              onSubmitSearchValue={onSubmitSearchValue}
            >
              <button
                type="button"
                onClick={() => onRefreshData()}
                disabled={isLoading}
                className="btn btn-sm btn-ghost disabled:bg-transparent"
                aria-label="Rafraîchir la liste des utilisateurs"
              >
                <RefreshCw className={isLoading ? "animate-spin" : ""} />
              </button>
              <PermissionGuard object="user" action="delete">
                <TableActionsButtons<User>
                  isLoading={isLoading || isDeleting}
                  isDisabled={selectedIds.length === 0}
                  onRefreshData={onRefreshData}
                  showRefresh={false}
                  actions={[
                    {
                      title: "Supprimer les utilisateurs sélectionnés",
                      description: `${selectedIds.length} utilisateur(s) vont être supprimé(s). Cette action est irréversible.`,
                      rightButtonTitle: "Supprimer",
                      alertMessageBottom:
                        "Les données liées aux comptes sélectionnés seront également supprimées ou transférées selon leur rôle.",
                      onConfirm: () => onDeleteSelected(selectedIds),
                    },
                  ]}
                  retreiveItemsProperty="lastname"
                  onRetreiveItemsValuesByPropertyFromIdList={selectedUserNames}
                />
              </PermissionGuard>
            </SearchBar>
          </div>
        ) : null}

        <div className="w-full" data-page-tour="table">
          <DataTable
            columns={columns}
            data={data}
            isLoading={isLoading}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            sorting={sorting}
            setSorting={handleSortingChange}
            onRowClick={handleRowClick}
            isRowClickable={isStudent}
            canSelectRow={(listedUser) =>
              canManageUser(listedUser, currentUserRank)
            }
            emptyMessage={
              searchValue
                ? "Aucun utilisateur disponible pour cette recherche"
                : "Aucun utilisateur disponible"
            }
          />
        </div>

        {data.length > 0 ? (
          <div className="w-full mt-5" data-page-tour="pagination">
            <TablePagination
              leftText={`Utilisateurs : ${totalItems}`}
              {...pagination}
            />
          </div>
        ) : null}
      </Wrapper>

      <TableActionsModal
        isOpen={!!idToDelete}
        onCancel={handleCancelSingleDelete}
        title="Confirmation de suppression"
        description="Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible."
        descList={
          userToDelete
            ? [`${userToDelete.firstname} ${userToDelete.lastname}`]
            : undefined
        }
        alertMessageBottom={deleteWarning}
        error={deleteError}
      >
        <button
          className={`btn btn-error btn-md ${isDeleting ? "loading" : ""}`}
          onClick={handleConfirmSingleDelete}
          disabled={isDeleting}
        >
          Confirmer
        </button>
      </TableActionsModal>

      <TableActionsModal
        isOpen={!!idToResetPassword}
        onCancel={() => setIdToResetPassword(null)}
        title="Envoi d'un mail de réinitialisation"
        description="Êtes-vous sûr de vouloir envoyer un mail de réinitialisation de mot de passe à cet utilisateur ?"
        descList={
          userToResetPassword
            ? [
                `${userToResetPassword.firstname} ${userToResetPassword.lastname}`,
              ]
            : undefined
        }
      >
        <button
          className="btn btn-warning btn-md"
          onClick={handleConfirmResetPassword}
        >
          Confirmer
        </button>
      </TableActionsModal>

      <TableActionsModal
        isOpen={!!idToResendInvitation}
        onCancel={() => setIdToResendInvitation(null)}
        title={
          userToResendInvitation?.invitationSent
            ? "Renvoi d'une invitation"
            : "Envoi d'une invitation"
        }
        description={
          userToResendInvitation?.invitationSent
            ? "L'invitation a déjà été envoyée. Voulez-vous la renvoyer ?"
            : "Êtes-vous sûr de vouloir envoyer une invitation d'activation à cet utilisateur ?"
        }
        descList={
          userToResendInvitation
            ? [
                `${userToResendInvitation.firstname} ${userToResendInvitation.lastname}`,
              ]
            : undefined
        }
      >
        <button
          className="btn btn-primary btn-md"
          onClick={handleConfirmResendInvitation}
        >
          Confirmer
        </button>
      </TableActionsModal>
    </div>
  );
};

export default UserHome;
