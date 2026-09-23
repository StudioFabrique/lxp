import { formatTitle } from "../../../../utils/helpers/text-helpers";
import { useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Copy, Layers3, Upload } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";

import Modal from "../../../../components/UI/modal/modal";
import BoxWrapper from "../../../../components/wrappers/BoxWrapper";
import Loader from "../../../../components/loaders/Loader";
import Selecter from "../../../../components/UI/selecter/selecter.component";
import RoleRankGuard from "../../../../components/guards/RoleRankGuard";
import PermissionGuard from "../../../../components/guards/PermissionGuard";
import { emitOnboardingEvent } from "../../../onboarding/onboarding-events";
import { parcoursApi } from "../../api/parcours.api";
import NewParcoursForm from "../edit/new-parcours-form";
import ParcoursImportModal, {
  type ImportFormationChoice,
} from "../import/ParcoursImportModal";
import {
  findDetectedFormationId,
  readParcoursArchiveFormationTitle,
  selectImportFormationId,
} from "../../helpers/read-parcours-archive-formation";
import { cn } from "../../../../utils/cn";

type Item = { id: number; title: string };
type Mode = "create" | "template" | "import";

type Props = {
  initialFormationId?: number;
  onClose: () => void;
};

export default function ParcoursCreationModal({
  initialFormationId,
  onClose,
}: Props) {
  const navigate = useNavigate();
  const archiveInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<Mode>("create");
  const [formationId, setFormationId] = useState(initialFormationId);
  const [parcoursId, setParcoursId] = useState<number>();
  const [pendingArchive, setPendingArchive] = useState<File>();
  const [initialImportFormationChoice, setInitialImportFormationChoice] =
    useState<ImportFormationChoice>();
  const [detectedFormationTitle, setDetectedFormationTitle] = useState("");

  const { data: formations } = useQuery({
    queryKey: ["formations"],
    queryFn: parcoursApi.queries.getFormations,
  });
  const formationList: Item[] = Array.isArray(formations) ? formations : [];

  const { data: parcoursList = [], isError: isParcoursListError } = useQuery({
    queryKey: ["parcours", "formation", formationId],
    queryFn: async () => (await parcoursApi.queries.getByFormation(formationId!)).data,
    enabled: mode === "template" && formationId !== undefined,
  });

  const { mutate: createParcours, isPending: isCreating } = useMutation({
    mutationFn: ({ title, formationId }: { title: string; formationId: number }) =>
      parcoursApi.mutations.createParcours({ title, formation: formationId }),
    onSuccess: (data) => {
      emitOnboardingEvent({ type: "parcours_created", id: data.parcoursId });
      navigate(`/admin/parcours/edit/${data.parcoursId}`);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message ?? "Le parcours n'a pas pu être enregistré.");
    },
  });

  const { mutate: duplicateParcours, isPending: isDuplicating } = useMutation({
    mutationFn: parcoursApi.mutations.duplicateParcours,
    onSuccess: (data) => {
      if (!data.success) {
        toast.error("Le parcours n'a pas pu être dupliqué.");
        return;
      }
      toast.success("Parcours dupliqué avec succès");
      navigate(`/admin/parcours/edit/${data.parcoursId}`);
    },
    onError: () => toast.error("Le parcours n'a pas pu être dupliqué."),
  });

  const { mutate: importParcours, isPending: isImporting } = useMutation({
    mutationFn: parcoursApi.mutations.importParcours,
    onSuccess: (data) => {
      toast.success(`Le parcours « ${data.title} » a été importé.`);
      if (data.warnings.length > 0) {
        toast(`${data.warnings.length} fichier(s) étaient manquants lors de l'export.`);
      }
      navigate(`/admin/parcours/edit/${data.parcoursId}`);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message ?? "Le parcours n'a pas pu être importé.");
    },
  });

  const isPending = isCreating || isDuplicating || isImporting;
  const close = () => {
    if (!isPending) onClose();
  };

  const backToCreate = () => {
    if (isPending) return;
    setMode("create");
    setParcoursId(undefined);
    setPendingArchive(undefined);
    setInitialImportFormationChoice(undefined);
    setDetectedFormationTitle("");
  };

  const handleArchiveSelection = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const archive = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!archive) return;
    if (!archive.name.toLowerCase().endsWith(".zip")) {
      toast.error("Sélectionnez une archive au format .zip.");
      return;
    }
    try {
      const formationTitle = await readParcoursArchiveFormationTitle(archive);
      const detectedFormationId = findDetectedFormationId(formationList, formationTitle);
      setPendingArchive(archive);
      setDetectedFormationTitle(formationTitle);
      setInitialImportFormationChoice(
        selectImportFormationId(initialFormationId, detectedFormationId),
      );
      setMode("import");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Le parcours n'a pas pu être importé.");
    }
  };

  return (
    <Modal
      title={mode === "create" ? "Création d'un parcours" : mode === "template" ? "Créer un parcours à partir d'un modèle" : "Importer un parcours"}
      titleTooltip={mode === "template" ? "Les objectifs, compétences, contacts, modules, cours, leçons et activités du parcours sélectionné seront dupliqués." : undefined}
      onLeftClick={mode === "create" ? close : mode === "template" ? backToCreate : undefined}
      leftLabel={mode === "create" ? "Fermer" : "Retour"}
      closeButtonAtTop={mode === "create"}
      onRightClick={mode === "template" ? () => { if (parcoursId !== undefined) duplicateParcours(parcoursId); } : undefined}
      rightLabel="Dupliquer le parcours"
      rightDisabled={parcoursId === undefined}
      isSubmitting={isDuplicating}
      modalBoxStyle="w-11/12 max-w-3xl"
    >
      {mode === "create" ? (
        isCreating ? <Loader variant="panel" label="Création du parcours" /> : (
          <div className="mt-6 flex flex-col gap-6">
            <p>Pour commencer, veuillez saisir les informations nécessaires pour créer le parcours</p>
            <div data-onboarding="parcours-create">
              <BoxWrapper>
                <h2 className="text-lg font-bold">Créer un nouveau parcours</h2>
                <NewParcoursForm
                  formations={formationList}
                  initialFormationId={initialFormationId}
                  onCreateFormation={close}
                  onSubmit={createParcours}
                />
              </BoxWrapper>
            </div>
            <div className="divider">ou</div>
            <button
              className="btn btn-outline btn-secondary w-full min-h-14"
              type="button"
              onClick={() => setMode("template")}
            >
              <Layers3 className="h-5 w-5" />
              Créer un parcours à partir d'un modèle
            </button>
            <RoleRankGuard ranks={[0, 1]}>
              <PermissionGuard action="write" object="parcours">
                <input
                  ref={archiveInputRef}
                  type="file"
                  accept=".zip,application/zip"
                  className="hidden"
                  onChange={handleArchiveSelection}
                />
                <button
                  className="btn btn-outline btn-secondary w-full min-h-14"
                  type="button"
                  onClick={() => archiveInputRef.current?.click()}
                >
                  <Upload className="h-5 w-5" />
                  Importer un parcours (.zip)
                </button>
              </PermissionGuard>
            </RoleRankGuard>
          </div>
        )
      ) : mode === "template" ? (
        <>
          <div className="mt-6 flex flex-col gap-5">
            <div>
              <label className="mb-2 block text-sm font-semibold">Rechercher par formation</label>
              <Selecter
                list={formationList}
                title="Sélectionner une formation"
                defaultItem={{ id: initialFormationId ?? 0, title: "" }}
                onSelectItem={(id) => { setFormationId(id); setParcoursId(undefined); }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold">Parcours disponibles</p>
              {!formationId ? (
                <p className="p-6 text-center text-sm text-base-content/60">Sélectionnez une formation pour afficher ses parcours.</p>
              ) : isParcoursListError ? (
                <p className="p-6 text-center text-sm text-error">Erreur lors du chargement des parcours.</p>
              ) : parcoursList.length === 0 ? (
                <p className="rounded-xl p-6 text-center text-sm text-base-content/60">Aucun parcours ne peut être utilisé comme modèle.</p>
              ) : (
                <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                  {parcoursList.map((item: Item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setParcoursId(item.id)}
                      className={cn("flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors", parcoursId === item.id ? "border-primary bg-primary/10" : "border-base-300 bg-base-100 hover:border-primary/50 cursor-pointer")}
                    >
                      <Copy className="h-4 w-4 shrink-0 text-primary" />
                      <span className="font-medium">{formatTitle(item.title)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      ) : pendingArchive ? (
        <ParcoursImportModal
          key={pendingArchive.name}
          archive={pendingArchive}
          detectedFormationTitle={detectedFormationTitle}
          formations={formationList}
          initialFormationChoice={initialImportFormationChoice}
          isImporting={isImporting}
          onCancel={backToCreate}
          onImport={importParcours}
          embedded
        />
      ) : null}
    </Modal>
  );
}
