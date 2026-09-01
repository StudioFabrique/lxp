import { useState } from "react";
import { Link } from "react-router";
import type { FormationParcoursSummary } from "../interfaces/parcours-summary";
import { Edit3, ExternalLink, Plus } from "lucide-react";
import { cn } from "../../../utils/cn";
import { normalizeImageSource } from "../../../utils/images/image-source";
import defaultParcoursImage from "../../../assets/images/new-parcours-default.jpg";
import CursorGlowCard from "../../../components/UI/cursor-glow-card";
import Modal from "../../../components/UI/modal/modal";
import PermissionGuard from "../../../components/guards/PermissionGuard";
import ParcoursActionsMenu from "../../parcours/components/list/parcours-actions-menu";

const fullDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
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
};

const ParcoursRow = ({
  item,
  baseRoute,
  showManagementActions = false,
  onDelete,
}: {
  item: FormationParcoursSummary["parcours"][number];
  baseRoute: "admin" | "student";
  showManagementActions?: boolean;
  onDelete?: (item: FormationParcoursSummary["parcours"][number]) => void;
}) => (
  <li className="list-row" key={item.id}>
    <div className="self-center">
      <img
        src={normalizeImageSource(item.thumb) ?? defaultParcoursImage}
        alt={`Illustration du parcours ${item.title}`}
        className="size-10 rounded-lg object-cover"
      />
    </div>

    <div className="list-col-grow min-w-0 self-center">
      <div className="font-semibold truncate">{item.title}</div>
      <div className="text-xs font-light opacity-50">
        {getDatesTooltip(item.startDate, item.endDate)}
      </div>
    </div>

    {showManagementActions && onDelete ? (
      <ParcoursActionsMenu parcours={item} onDelete={onDelete} />
    ) : (
      <Link
        className="btn btn-square btn-sm btn-ghost self-center"
        to={`/${baseRoute}/parcours/view/${item.id}`}
        aria-label={`Prévisualiser le parcours ${item.title}`}
      >
        <ExternalLink className="size-[1.2em]" />
      </Link>
    )}
  </li>
);

const LastParcoursItem = ({
  formation,
  maxParcoursShown = 3,
  isManagementView = false,
  baseRoute = "admin",
  onCreateFormation,
  onEditFormation,
  onDeleteParcours,
}: LastParcoursItemProps) => {
  const [showRemainingParcours, setShowRemainingParcours] = useState(false);
  const remainingParcours = formation?.parcours.slice(maxParcoursShown) ?? [];
  const requestParcoursDeletion = (
    parcours: FormationParcoursSummary["parcours"][number],
  ) => {
    setShowRemainingParcours(false);
    onDeleteParcours?.(parcours);
  };

  return (
    <>
      <CursorGlowCard
        glowColor="info"
        glowSize={2.5}
        className="h-full rounded-box"
      >
        <ul
          className={cn(
            "list border border-base-300 rounded-box overflow-hidden h-full min-h-52",
            {
              "border-dashed border-primary/25": !formation,
              "bg-base-200": Boolean(formation),
            },
          )}
        >
          {formation && (
            <>
              <li className="p-4 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs opacity-60 tracking-wide select-none">
                      Formation
                    </p>
                    <h4 className="font-bold text-xl truncate">
                      {formation.title}
                    </h4>
                  </div>
                  {isManagementView && onEditFormation ? (
                    <PermissionGuard action="update" object="formation">
                      <button
                        type="button"
                        className="btn btn-square btn-sm btn-ghost shrink-0 tooltip tooltip-left"
                        data-tip="Modifier la formation"
                        aria-label={`Modifier la formation ${formation.title}`}
                        onClick={() => onEditFormation(formation.id)}
                      >
                        <Edit3 className="size-[1.2em]" />
                      </button>
                    </PermissionGuard>
                  ) : null}
                </div>
              </li>
              {formation.parcours.slice(0, maxParcoursShown).map((item) => (
                <ParcoursRow
                  key={item.id}
                  item={item}
                  baseRoute={baseRoute}
                  showManagementActions={
                    isManagementView && baseRoute === "admin"
                  }
                  onDelete={requestParcoursDeletion}
                />
              ))}
              {isManagementView && remainingParcours.length > 0 ? (
                <li className="px-5 pt-3 flex justify-center">
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost text-primary"
                    onClick={() => setShowRemainingParcours(true)}
                  >
                    Afficher plus de parcours ({remainingParcours.length})
                  </button>
                </li>
              ) : null}
              {baseRoute === "admin" ? (
                <li className="mt-auto flex flex-col gap-2 items-center py-5">
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
                </li>
              ) : null}
            </>
          )}
          {!formation ? (
            <li className="flex flex-1 items-center justify-center p-6">
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
            </li>
          ) : null}
        </ul>
      </CursorGlowCard>

      {formation && showRemainingParcours ? (
        <Modal
          title={`Autres parcours de ${formation.title}`}
          leftLabel="Fermer"
          onLeftClick={() => setShowRemainingParcours(false)}
          modalBoxStyle="max-w-2xl"
          dialogAdditionalClass="z-20"
        >
          <ul className="list border border-base-300 rounded-box overflow-hidden bg-base-200 mt-5">
            {remainingParcours.map((item) => (
              <ParcoursRow
                key={item.id}
                item={item}
                baseRoute={baseRoute}
                showManagementActions={baseRoute === "admin"}
                onDelete={requestParcoursDeletion}
              />
            ))}
          </ul>
        </Modal>
      ) : null}
    </>
  );
};

export default LastParcoursItem;
