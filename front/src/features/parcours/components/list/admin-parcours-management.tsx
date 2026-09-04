import { useContext, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router";
import { PlusCircle } from "lucide-react";
import toast from "react-hot-toast";

import Header from "../../../../components/headers/Header";
import PermissionGuard from "../../../../components/guards/PermissionGuard";
import EmptyStatePlaceholder from "../../../../components/UI/empty-state-placeholder";
import Modal from "../../../../components/UI/modal/modal";
import FormationModal from "../../../formation/components/FormationModal";
import LastParcoursItem from "../../../dashboard-admin/components/last-parcours-item";
import type ParcoursSummary from "../../../dashboard-admin/interfaces/parcours-summary";
import type { FormationParcoursSummary } from "../../../dashboard-admin/interfaces/parcours-summary";
import { emitOnboardingEvent } from "../../../onboarding/onboarding-events";
import { getApiErrorMessage } from "../../../../utils/helpers/api-error-message";
import { hasRoleRank } from "../../../../utils/helpers/user-role";
import { AuthContext } from "../../../../store/AuthProvider";
import { parcoursApi } from "../../api/parcours.api";

type AdminParcoursManagementProps = {
  formations: FormationParcoursSummary[];
  layout: "admin" | "student";
};

const AdminParcoursManagement = ({
  formations,
  layout,
}: AdminParcoursManagementProps) => {
  const isAdmin = layout === "admin";
  const { user } = useContext(AuthContext);
  const isTeacher = hasRoleRank(user, [2]);
  const usesFullWidthLayout = !isAdmin || isTeacher;
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [parcoursToDelete, setParcoursToDelete] =
    useState<ParcoursSummary | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [formationModal, setFormationModal] = useState<{
    isOpen: boolean;
    formationId: number | null;
  }>({
    isOpen: searchParams.get("createFormation") === "true",
    formationId: null,
  });

  const deleteParcoursMutation = useMutation({
    mutationFn: parcoursApi.mutations.deleteParcours,
    onSuccess: (response) => {
      toast.success(response.message);
      setParcoursToDelete(null);
      setDeleteConfirmation("");
      void queryClient.invalidateQueries({ queryKey: ["root-parcours"] });
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, "Le parcours n’a pas pu être supprimé."),
      );
    },
  });

  const exportParcoursMutation = useMutation({
    mutationFn: (parcours: ParcoursSummary) =>
      parcoursApi.mutations.exportParcours(parcours.id),
    onSuccess: ({ archive, contentDisposition }, parcours) => {
      const encodedFilename = contentDisposition?.match(
        /filename\*=UTF-8''([^;]+)/i,
      )?.[1];
      const plainFilename = contentDisposition?.match(
        /filename="?([^";]+)"?/i,
      )?.[1];
      const fallbackFilename = `${
        parcours.title
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-zA-Z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
          .toLowerCase() || "parcours"
      }.zip`;
      const filename = encodedFilename
        ? decodeURIComponent(encodedFilename)
        : plainFilename || fallbackFilename;
      const url = URL.createObjectURL(archive);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success("Archive du parcours téléchargée.");
    },
    onError: () => toast.error("Le parcours n’a pas pu être exporté."),
  });

  const openFormationCreation = () => {
    setFormationModal({ isOpen: true, formationId: null });
    emitOnboardingEvent({ type: "formation_entry_clicked" });
  };

  const openFormationEdition = (formationId: number) => {
    setFormationModal({ isOpen: true, formationId });
  };

  const closeFormationModal = () => {
    setFormationModal({ isOpen: false, formationId: null });
    if (searchParams.has("createFormation")) {
      const nextSearchParams = new URLSearchParams(searchParams);
      nextSearchParams.delete("createFormation");
      setSearchParams(nextSearchParams, { replace: true });
    }
  };

  const openParcoursDeletion = (parcours: ParcoursSummary) => {
    setParcoursToDelete(parcours);
    setDeleteConfirmation("");
  };

  const closeParcoursDeletion = () => {
    if (deleteParcoursMutation.isPending) return;
    setParcoursToDelete(null);
    setDeleteConfirmation("");
  };

  const confirmParcoursDeletion = () => {
    if (
      !parcoursToDelete ||
      deleteConfirmation.trim() !== parcoursToDelete.title
    ) {
      return;
    }

    deleteParcoursMutation.mutate(parcoursToDelete.id);
  };

  return (
    <main className="w-full flex flex-col gap-8">
      <Header
        title={isAdmin ? "Gestion des parcours" : "Liste des parcours"}
        description={
          isAdmin
            ? "Gérez les formations et les parcours qui leur sont associés."
            : "Retrouvez les parcours qui vous sont attribués, regroupés par formation."
        }
      >
        {isAdmin ? (
          <div className="flex flex-wrap justify-end gap-2">
            <PermissionGuard action="write" object="formation">
              <button
                type="button"
                className="btn btn-primary btn-soft"
                data-onboarding="formation-create-entry"
                onClick={openFormationCreation}
              >
                <PlusCircle />
                Créer une formation
              </button>
            </PermissionGuard>
            <PermissionGuard action="write" object="parcours">
              <Link className="btn btn-primary btn-soft" to="new">
                <PlusCircle />
                Créer un parcours
              </Link>
            </PermissionGuard>
          </div>
        ) : null}
      </Header>

      <section
        className={`grid items-start gap-5 ${
          usesFullWidthLayout ? "grid-cols-1" : "lg:grid-cols-2 xl:grid-cols-3"
        }`}
        data-page-tour="parcours-cards"
      >
        {formations.length === 0 ? (
          <div className="col-span-full">
            <EmptyStatePlaceholder title="Aucun parcours disponible" />
          </div>
        ) : null}
        {formations.map((formation) => (
          <LastParcoursItem
            key={formation.id}
            maxParcoursShown={4}
            formation={formation}
            isManagementView
            baseRoute={layout}
            fullWidth={usesFullWidthLayout}
            onEditFormation={isAdmin ? openFormationEdition : undefined}
            onDeleteParcours={isAdmin ? openParcoursDeletion : undefined}
            onExportParcours={
              isAdmin
                ? (parcours) => exportParcoursMutation.mutate(parcours)
                : undefined
            }
            exportingParcoursId={
              exportParcoursMutation.isPending
                ? exportParcoursMutation.variables?.id
                : null
            }
          />
        ))}
        {isAdmin && formations.length > 0 ? (
          <PermissionGuard action="write" object="parcours">
            <LastParcoursItem onCreateFormation={openFormationCreation} />
          </PermissionGuard>
        ) : null}
      </section>

      {isAdmin && formationModal.isOpen ? (
        <FormationModal
          formationId={formationModal.formationId}
          onClose={closeFormationModal}
        />
      ) : null}

      {isAdmin && parcoursToDelete ? (
        <Modal
          title={`Supprimer le parcours « ${parcoursToDelete.title} »`}
          leftLabel="Annuler"
          rightLabel="Supprimer"
          rightDisabled={deleteConfirmation.trim() !== parcoursToDelete.title}
          isSubmitting={deleteParcoursMutation.isPending}
          onLeftClick={closeParcoursDeletion}
          onRightClick={confirmParcoursDeletion}
          modalBoxStyle="max-w-xl"
        >
          <div className="flex flex-col gap-4 py-5">
            <p>
              Le parcours, ses modules, cours, leçons, activités et
              rattachements seront définitivement supprimés.
            </p>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold">
                Saisissez « {parcoursToDelete.title} » pour confirmer.
              </span>
              <input
                className="input input-bordered w-full"
                value={deleteConfirmation}
                onChange={(event) => setDeleteConfirmation(event.target.value)}
                autoComplete="off"
                autoFocus
                disabled={deleteParcoursMutation.isPending}
              />
            </label>
          </div>
        </Modal>
      ) : null}
    </main>
  );
};

export default AdminParcoursManagement;
