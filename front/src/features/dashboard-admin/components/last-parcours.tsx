import { formatTitle } from "../../../utils/helpers/text-helpers";
import { useContext, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router";
import { MoveUpRight } from "lucide-react";
import toast from "react-hot-toast";
import type { FormationParcoursSummary } from "../interfaces/parcours-summary";
import type ParcoursSummary from "../interfaces/parcours-summary";
import LastParcoursItem from "./last-parcours-item";
import QuickActions from "./quick-actions";
import FormationModal from "../../formation/components/FormationModal";
import { emitOnboardingEvent } from "../../onboarding/onboarding-events";
import PermissionGuard from "../../../components/guards/PermissionGuard";
import { AuthContext } from "../../../store/AuthProvider";
import { isTeacherUser } from "../../../utils/helpers/user-role";
import ParcoursCreationModal from "../../parcours/components/create/ParcoursCreationModal";
import Modal from "../../../components/UI/modal/modal";
import { parcoursApi } from "../../parcours/api/parcours.api";
import { getApiErrorMessage } from "../../../utils/helpers/api-error-message";
import { cn } from "../../../utils/cn";

type LastParcoursProps = {
  parcours: FormationParcoursSummary[];
  isLoading: boolean;
};

export default function LastParcours({
  parcours,
  isLoading,
}: LastParcoursProps) {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const isTeacher = isTeacherUser(user);
  const displayedFormations = parcours.slice(0, 6);
  const usesFullWidthLayout = isTeacher && displayedFormations.length === 1;
  const gridClassName = usesFullWidthLayout
    ? "grid-cols-1"
    : "lg:grid-cols-2 xl:grid-cols-3";
  const [searchParams, setSearchParams] = useSearchParams();
  const [formationModal, setFormationModal] = useState<{
    isOpen: boolean;
    formationId: number | null;
  }>({
    isOpen: searchParams.get("createFormation") === "true",
    formationId: null,
  });
  const [parcoursFormationId, setParcoursFormationId] = useState<number | null>(null);
  const [parcoursToDelete, setParcoursToDelete] = useState<ParcoursSummary | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const isParcoursModalOpen =
    parcoursFormationId !== null || searchParams.get("createParcours") === "true";
  const requestedFormationId = Number(searchParams.get("formationId"));
  const initialFormationId = parcoursFormationId && parcoursFormationId > 0
    ? parcoursFormationId
    : Number.isInteger(requestedFormationId) && requestedFormationId > 0
      ? requestedFormationId
      : undefined;

  const closeParcoursModal = () => {
    setParcoursFormationId(null);
    if (searchParams.has("createParcours")) {
      const nextSearchParams = new URLSearchParams(searchParams);
      nextSearchParams.delete("createParcours");
      nextSearchParams.delete("formationId");
      setSearchParams(nextSearchParams, { replace: true });
    }
  };

  const openFormationModal = () => {
    setFormationModal({ isOpen: true, formationId: null });
    emitOnboardingEvent({ type: "formation_entry_clicked" });
  };

  const closeFormationModal = () => {
    setFormationModal({ isOpen: false, formationId: null });
    if (searchParams.has("createFormation")) {
      const nextSearchParams = new URLSearchParams(searchParams);
      nextSearchParams.delete("createFormation");
      setSearchParams(nextSearchParams, { replace: true });
    }
  };

  const deleteParcoursMutation = useMutation({
    mutationFn: parcoursApi.mutations.deleteParcours,
    onSuccess: (response) => {
      toast.success(response.message);
      setParcoursToDelete(null);
      setDeleteConfirmation("");
      void queryClient.invalidateQueries({ queryKey: ["root-parcours"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Le parcours n'a pas pu être supprimé."));
    },
  });

  const exportParcoursMutation = useMutation({
    mutationFn: (item: ParcoursSummary) => parcoursApi.mutations.exportParcours(item.id),
    onSuccess: ({ archive, contentDisposition }, item) => {
      const encodedFilename = contentDisposition?.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
      const plainFilename = contentDisposition?.match(/filename="?([^";]+)"?/i)?.[1];
      const fallbackFilename = `${item.title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase() || "parcours"}.zip`;
      const url = URL.createObjectURL(archive);
      const link = document.createElement("a");
      link.href = url;
      link.download = encodedFilename ? decodeURIComponent(encodedFilename) : plainFilename || fallbackFilename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success("Archive du parcours téléchargée.");
    },
    onError: () => toast.error("Le parcours n'a pas pu être exporté."),
  });

  const closeParcoursDeletion = () => {
    if (deleteParcoursMutation.isPending) return;
    setParcoursToDelete(null);
    setDeleteConfirmation("");
  };

  const confirmParcoursDeletion = () => {
    if (!parcoursToDelete || deleteConfirmation.trim() !== parcoursToDelete.title) return;
    deleteParcoursMutation.mutate(parcoursToDelete.id);
  };

  return (
    <div className="p-2">
      <div className="flex flex-wrap justify-between items-center gap-4">
        {parcours.length > 0 && (
          <h3 className="text-xl font-bold text-primary select-none">
            Derniers parcours ajoutés
          </h3>
        )}
        <QuickActions
          onCreateFormation={openFormationModal}
          onCreateParcours={() => setParcoursFormationId(-1)}
        />
      </div>

      <div className="w-full mt-4">
        {isLoading ? (
          <div className={cn("grid gap-5", gridClassName)}>
            {[0, 1, 2].map((item) => (
              <div
                className="h-72 skeleton rounded-box"
                key={item}
                aria-hidden="true"
              />
            ))}
          </div>
        ) : (
          <div className={cn("grid items-start gap-5", gridClassName)}>
            {displayedFormations.map((formation) => (
              <LastParcoursItem
                key={formation.id}
                formation={formation}
                fullWidth={usesFullWidthLayout}
                isManagementView
                onCreateParcours={setParcoursFormationId}
                onDeleteParcours={(item) => {
                  setParcoursToDelete(item);
                  setDeleteConfirmation("");
                }}
                onExportParcours={(item) => exportParcoursMutation.mutate(item)}
                exportingParcoursId={exportParcoursMutation.isPending ? exportParcoursMutation.variables?.id : null}
              />
            ))}
            <PermissionGuard action="write" object="parcours">
              <LastParcoursItem onCreateFormation={openFormationModal} />
            </PermissionGuard>
          </div>
        )}
      </div>
      {parcours.length > 0 && (
        <div className="flex justify-end mt-2">
          <Link
            className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline select-none"
            to="/admin/parcours"
          >
            Voir tous les parcours <MoveUpRight className="w-4 h-4" />
          </Link>
        </div>
      )}
      {formationModal.isOpen ? (
        <FormationModal formationId={formationModal.formationId} onClose={closeFormationModal} />
      ) : null}
      {isParcoursModalOpen ? (
        <ParcoursCreationModal
          initialFormationId={initialFormationId}
          onClose={closeParcoursModal}
        />
      ) : null}
      {parcoursToDelete ? (
        <Modal
          title={`Supprimer le parcours « ${formatTitle(parcoursToDelete.title)} »`}
          leftLabel="Annuler"
          rightLabel="Supprimer"
          rightDisabled={deleteConfirmation.trim() !== parcoursToDelete.title}
          isSubmitting={deleteParcoursMutation.isPending}
          onLeftClick={closeParcoursDeletion}
          onRightClick={confirmParcoursDeletion}
          modalBoxStyle="max-w-xl"
        >
          <div className="flex flex-col gap-4 py-5">
            <p>Le parcours, ses modules, cours, leçons, activités et rattachements seront définitivement supprimés.</p>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold">Saisissez « {parcoursToDelete.title} » pour confirmer.</span>
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
    </div>
  );
}
