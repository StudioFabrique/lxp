import { Link } from "react-router";
import type { FormationParcoursSummary } from "../interfaces/parcours-summary";
import { Edit3, Plus } from "lucide-react";
import { cn } from "../../../utils/cn";
import { normalizeImageSource } from "../../../utils/images/image-source";
import defaultParcoursImage from "../../../assets/images/new-parcours-default.jpg";
import PermissionGuard from "../../../components/guards/PermissionGuard";
import ParcoursActionsMenu from "../../parcours/components/list/parcours-actions-menu";
import HierarchicalListCard from "../../../components/UI/hierarchical-list-card/HierarchicalListCard";

const fullDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function getDatesTooltip(startDate: string | null, endDate: string | null) {
  const formatDate = (date: string | null) => {
    if (!date) return "non définie";

    const parsedDate = new Date(date);
    return Number.isNaN(parsedDate.getTime())
      ? "non définie"
      : fullDateFormatter.format(parsedDate);
  };

  return `Du ${formatDate(startDate)} au ${formatDate(endDate)}`;
}

type LastParcoursItemProps = {
  formation?: FormationParcoursSummary;
  maxParcoursShown?: number;
  isManagementView?: boolean;
  baseRoute?: "admin" | "student";
  onCreateFormation?: () => void;
  onEditFormation?: (formationId: number) => void;
  onDeleteParcours?: (
    parcours: FormationParcoursSummary["parcours"][number],
  ) => void;
  onExportParcours?: (
    parcours: FormationParcoursSummary["parcours"][number],
  ) => void;
  exportingParcoursId?: number | null;
  fullWidth?: boolean;
};

const LastParcoursItem = ({
  formation,
  maxParcoursShown = 2,
  isManagementView = false,
  baseRoute = "admin",
  onCreateFormation,
  onEditFormation,
  onDeleteParcours,
  onExportParcours,
  exportingParcoursId = null,
  fullWidth,
}: LastParcoursItemProps) => {
  const usesFullWidthLayout = fullWidth ?? baseRoute === "student";

  return (
    <HierarchicalListCard
      label={formation ? "Formation" : undefined}
      title={formation?.title}
      truncateTitle
      items={formation?.parcours.map((item) => ({
        id: item.id,
        title: item.title,
        description: getDatesTooltip(item.startDate, item.endDate),
        subDescription: item.isPublished ? (
          <span className="text-success">Publié</span>
        ) : (
          <span className="text-warning">Non publié</span>
        ),
        image: {
          src: normalizeImageSource(item.thumb) ?? defaultParcoursImage,
          alt: `Illustration du parcours ${item.title}`,
        },
        to: `/${baseRoute}/parcours/view/${item.id}`,
        ariaLabel: `Prévisualiser le parcours ${item.title}`,
        action:
          isManagementView && baseRoute === "admin" && onDeleteParcours
            ? (dismissOverflow) => (
                <ParcoursActionsMenu
                  parcours={item}
                  onDelete={(parcours) => {
                    dismissOverflow();
                    onDeleteParcours(parcours);
                  }}
                  onExport={onExportParcours}
                  isExporting={exportingParcoursId === item.id}
                />
              )
            : undefined,
      }))}
      action={
        formation &&
        isManagementView &&
        onEditFormation &&
        formation.canManage !== false ? (
          <PermissionGuard action="update" object="formation">
            <button
              type="button"
              className="btn btn-square btn-sm btn-ghost tooltip tooltip-left"
              data-tip="Modifier la formation"
              aria-label={`Modifier la formation ${formation.title}`}
              onClick={() => onEditFormation(formation.id)}
            >
              <Edit3 className="size-[1.2em]" />
            </button>
          </PermissionGuard>
        ) : undefined
      }
      maxItemsShown={maxParcoursShown}
      showMore={isManagementView}
      emptyMessage="Aucun parcours associé"
      moreItemsLabel={(count) => `Afficher plus de parcours (${count})`}
      overflowTitle={
        formation ? `Autres parcours de ${formation.title}` : undefined
      }
      footer={
        formation && baseRoute === "admin" && !usesFullWidthLayout ? (
          <PermissionGuard action="write" object="parcours">
            <Link
              to={`/admin/parcours/new?formationId=${formation.id}`}
              className={cn("btn btn-sm btn-dash mx-5", {
                "self-end": formation.parcours.length > 0,
              })}
            >
              <Plus className="size-[1.2em]" />
              <span>Ajouter un parcours</span>
            </Link>
          </PermissionGuard>
        ) : undefined
      }
      placeholder={
        !formation ? (
          <PermissionGuard action="write" object="formation">
            <button
              type="button"
              className="btn btn-dash"
              data-onboarding="dashboard-formation-create-entry"
              onClick={onCreateFormation}
            >
              <Plus className="size-[1.2em]" />
              <span>Créer une formation</span>
            </button>
          </PermissionGuard>
        ) : undefined
      }
      fullWidth={usesFullWidthLayout}
    />
  );
};

export default LastParcoursItem;
