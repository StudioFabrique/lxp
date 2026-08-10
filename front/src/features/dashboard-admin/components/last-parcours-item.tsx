import { Link } from "react-router";
import type { FormationParcoursSummary } from "../interfaces/parcours-summary";
import { ExternalLink, Plus } from "lucide-react";
import { cn } from "../../../utils/cn";
import { normalizeImageSource } from "../../../utils/images/image-source";
import defaultParcoursImage from "../../../assets/images/new-parcours-default.jpg";
import CursorGlowCard from "../../../components/UI/cursor-glow-card";

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

const LastParcoursItem = ({
  formation,
}: {
  formation?: FormationParcoursSummary;
}) => {
  return (
    <CursorGlowCard className="h-full rounded-box">
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
              <div className="flex items-start justify-start gap-3">
                <div className="min-w-0">
                  <p className="text-xs opacity-60 tracking-wide">Formation</p>
                  <h4 className="font-bold text-xl truncate">
                    {formation.title}
                  </h4>
                </div>
              </div>
            </li>
            {formation.parcours.slice(0, 5).map((item) => (
              <li className="list-row" key={item.id}>
                <div className="self-center">
                  <img
                    src={
                      normalizeImageSource(item.thumb) ?? defaultParcoursImage
                    }
                    alt={`Illustration du parcours ${item.title}`}
                    className="size-10 rounded-lg object-cover"
                  />
                </div>

                <div className="list-col-grow min-w-0 self-center">
                  <div className="font-semibold truncate">{item.title}</div>
                  <div className="text-xs font-light opacity-50">
                    {/*{item.isPublished ? "Publié" : "Brouillon"}*/}
                    {getDatesTooltip(item.startDate, item.endDate)}
                  </div>
                </div>

                <Link
                  className="btn btn-square btn-sm btn-ghost self-center"
                  to={`/admin/parcours/view/${item.id}`}
                  aria-label={`Prévisualiser le parcours ${item.title}`}
                >
                  <ExternalLink className="size-[1.2em]" />
                </Link>
              </li>
            ))}
            <div className="h-full flex flex-col justify-center gap-2 items-center py-5">
              <Link
                to={`/admin/parcours/new?formationId=${formation.id}`}
                className={cn("btn btn-sm btn-dash mx-5", {
                  "self-end": formation.parcours.length > 0,
                })}
              >
                <Plus className="size-[1.2em]" />
                <span>Ajouter un parcours</span>
              </Link>
            </div>
          </>
        )}
        {!formation ? (
          <li className="flex flex-1 items-center justify-center p-6">
            <Link to="/admin/formation" className="btn btn-dash">
              <Plus className="size-[1.2em]" />
              <span>Créer une formation</span>
            </Link>
          </li>
        ) : null}
      </ul>
    </CursorGlowCard>
  );
};

export default LastParcoursItem;
