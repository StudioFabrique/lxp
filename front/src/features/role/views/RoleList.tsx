import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

import PageHeader from "../../../components/headers/PageHeader";
import { rolesPageTourSteps } from "../../../components/headers/page-tour-steps";
import PermissionGuard from "../../../components/guards/PermissionGuard";
import EmptyStatePlaceholder from "../../../components/UI/empty-state-placeholder";
import HierarchicalListCard from "../../../components/UI/hierarchical-list-card/HierarchicalListCard";
import Modal from "../../../components/UI/modal/modal";
import MultiCriteriaSearch from "../../../components/UI/multi-criteria-search";
import PageWrapper from "../../../components/wrappers/PageWrapper";
import TableActionsModal from "../../../components/table/TableActionsModal";
import TablePagination from "../../../components/table/TablePagination";
import Loader from "../../../components/loaders/Loader";
import useEagerLoadingList from "../../../hooks/useEagerLoadingList";
import { getApiErrorMessage } from "../../../utils/helpers/api-error-message";
import { normalizeSearchText } from "../../../utils/helpers/normalize-search-text";
import type Role from "../../../utils/interfaces/role";
import { roleApi, type PermissionTypes, type RoleCounts } from "../api/role.api";
import RoleCard from "../components/RoleCard";
import RolePermissionsDrawer from "../components/permissions/RolePermissionsDrawer";
import RoleForm from "../components/role-form/RoleForm";
import { useRoleActions } from "../hooks/useRoleActions";

type RoleFormModal =
  | { mode: "create" }
  | { mode: "edit" | "duplicate"; role: RoleCounts };

type PermissionDrawer = {
  role: RoleCounts;
  type: PermissionTypes;
  label: string;
};

const asRole = (role: RoleCounts): Role => role;

const RoleList = () => {
  const queryClient = useQueryClient();
  const [searchValue, setSearchValue] = useState("");
  const [formModal, setFormModal] = useState<RoleFormModal | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<RoleCounts | null>(null);
  const [roleToReset, setRoleToReset] = useState<RoleCounts | null>(null);
  const [permissionDrawer, setPermissionDrawer] =
    useState<PermissionDrawer | null>(null);
  const normalizedSearch = normalizeSearchText(searchValue);
  const isSearching = normalizedSearch.length > 0;

  const { data: rawData, isLoading } = useQuery<RoleCounts[]>({
    queryKey: ["roles"],
    queryFn: () => roleApi.queries.listRoles(),
  });
  const roles = useMemo(
    () =>
      [...(rawData ?? [])]
        .filter(
          (role) =>
            !normalizedSearch ||
            [role.role, role.label, role.model].some((value) =>
              normalizeSearchText(value).includes(normalizedSearch),
            ),
        )
        .sort((first, second) =>
          first.label.localeCompare(second.label, "fr", {
            numeric: true,
            sensitivity: "base",
          }),
        ),
    [normalizedSearch, rawData],
  );
  const { list, limit, page, totalPages, setLimit, setPage } =
    useEagerLoadingList(roles, "label", 12, "_id", "sidebar-roles");

  const refreshRoleQueries = () => {
    void queryClient.invalidateQueries({ queryKey: ["roles"] });
    void queryClient.invalidateQueries({ queryKey: ["permission-roles"] });
  };

  const {
    onDeleteOne,
    isDeleting,
    deleteError,
    resetDeleteError,
  } = useRoleActions(() => {
    setRoleToDelete(null);
    refreshRoleQueries();
  });

  const resetMutation = useMutation({
    mutationFn: (roleId: string) => roleApi.mutations.resetPermissions(roleId),
    onSuccess: (_data, roleId) => {
      toast.success("Permissions réinitialisées avec succès");
      setRoleToReset(null);
      refreshRoleQueries();
      void queryClient.invalidateQueries({
        queryKey: ["permission-resources", roleId],
      });
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Impossible de réinitialiser les permissions.",
        ),
      );
    },
  });

  const handleFormSuccess = () => {
    setFormModal(null);
    refreshRoleQueries();
  };

  const handleConfirmDelete = async () => {
    if (!roleToDelete) return;
    try {
      await onDeleteOne(roleToDelete._id);
    } catch {
      // L'erreur de l'API reste visible dans la modale et dans le toast.
    }
  };

  const openRoleDeletion = (role: RoleCounts) => {
    if (role.protection >= 1) return;
    resetDeleteError();
    setRoleToDelete(role);
  };

  const formRole = formModal && "role" in formModal ? formModal.role : null;

  return (
    <PageWrapper as="main">
      <PageHeader
        title="Gestion des rôles"
        description="Créez des rôles et gérez leurs droits d'accès"
        tourSteps={rolesPageTourSteps}
      >
        <PermissionGuard action="write" object="role">
          <button
            type="button"
            className="btn btn-outline btn-primary"
            data-page-tour="role-create-header"
            onClick={() => setFormModal({ mode: "create" })}
          >
            <Plus className="size-5" />
            Créer un rôle
          </button>
        </PermissionGuard>
      </PageHeader>

      {(rawData?.length ?? 0) > 0 ? (
        <div data-page-tour="role-filters">
          <MultiCriteriaSearch
            value={searchValue}
            onChange={(value) => {
              setSearchValue(value);
              setPage(1);
            }}
            placeholder="Rechercher un rôle..."
            criteria={["nom", "libellé", "modèle"]}
          />
        </div>
      ) : null}

      {isLoading ? (
        <div className="min-h-72">
          <Loader />
        </div>
      ) : (
        <section
          className="grid items-start gap-5 lg:grid-cols-2 xl:grid-cols-3"
          data-page-tour="role-cards"
        >
          {roles.length === 0 ? (
            <div className="col-span-full">
              <EmptyStatePlaceholder
                title={
                  isSearching
                    ? "Aucun rôle ne correspond à votre recherche"
                    : "Aucun rôle disponible"
                }
              />
            </div>
          ) : null}

          {(list as RoleCounts[] | null)?.map((role) => (
            <RoleCard
              key={role._id}
              role={role}
              onEdit={(selectedRole) =>
                setFormModal({ mode: "edit", role: selectedRole })
              }
              onReset={setRoleToReset}
              onDuplicate={(selectedRole) =>
                setFormModal({ mode: "duplicate", role: selectedRole })
              }
              onDelete={openRoleDeletion}
              onOpenPermissions={(selectedRole, type, label) =>
                setPermissionDrawer({ role: selectedRole, type, label })
              }
            />
          ))}

          <PermissionGuard action="write" object="role">
            <div data-page-tour="role-create-card">
              <HierarchicalListCard
                placeholder={
                  <button
                    type="button"
                    className="btn btn-dash"
                    onClick={() => setFormModal({ mode: "create" })}
                  >
                    <Plus className="size-[1.2em]" />
                    Créer un rôle
                  </button>
                }
              />
            </div>
          </PermissionGuard>
        </section>
      )}

      {!isLoading && roles.length > 0 ? (
        <TablePagination
          currentPage={page}
          maxPage={totalPages}
          itemsPerPage={limit}
          leftText={`Rôles : ${roles.length}`}
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
      ) : null}

      {formModal ? (
        <Modal
          title={
            formModal.mode === "create"
              ? "Créer un rôle"
              : formModal.mode === "duplicate"
                ? `Dupliquer le rôle « ${formRole?.label} »`
                : `Modifier le rôle « ${formRole?.label} »`
          }
          leftLabel="Fermer"
          onLeftClick={() => setFormModal(null)}
          closeButtonAtTop
          modalBoxStyle="max-w-3xl overflow-x-hidden"
          dialogAdditionalClass="z-50"
        >
          <div className="pt-6">
            {formModal.mode === "create" ? (
              <RoleForm embedded onSuccess={handleFormSuccess} />
            ) : formModal.mode === "duplicate" && formRole ? (
              <RoleForm
                embedded
                duplicateFrom={asRole(formRole)}
                onSuccess={handleFormSuccess}
              />
            ) : formRole ? (
              <RoleForm
                embedded
                role={asRole(formRole)}
                onSuccess={handleFormSuccess}
              />
            ) : null}
          </div>
        </Modal>
      ) : null}

      {roleToReset ? (
        <Modal
          title={`Réinitialiser les permissions de « ${roleToReset.label} »`}
          leftLabel="Annuler"
          rightLabel="Réinitialiser"
          rightClassName="btn-warning"
          isSubmitting={resetMutation.isPending}
          onLeftClick={() => setRoleToReset(null)}
          onRightClick={() => resetMutation.mutate(roleToReset._id)}
          modalBoxStyle="max-w-xl"
          dialogAdditionalClass="z-50"
        >
          <p className="py-5">
            Les permissions du rôle seront remplacées par celles de son modèle.
          </p>
        </Modal>
      ) : null}

      <PermissionGuard action="delete" object="role">
        <TableActionsModal
          isOpen={Boolean(roleToDelete)}
          onCancel={() => {
            setRoleToDelete(null);
            resetDeleteError();
          }}
          title="Confirmation de suppression"
          description="Êtes-vous sûr de vouloir supprimer ce rôle ?"
          descList={roleToDelete ? [roleToDelete.label] : undefined}
          alertMessageBottom="Cette opération ne peut pas être annulée."
          error={deleteError}
        >
          <button
            type="button"
            className="btn btn-error btn-md"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? <span className="loading loading-spinner" /> : null}
            Supprimer
          </button>
        </TableActionsModal>
      </PermissionGuard>

      {permissionDrawer ? (
        <RolePermissionsDrawer
          role={permissionDrawer.role}
          permissionType={permissionDrawer.type}
          permissionLabel={permissionDrawer.label}
          onClose={() => setPermissionDrawer(null)}
        />
      ) : null}
    </PageWrapper>
  );
};

export default RoleList;
