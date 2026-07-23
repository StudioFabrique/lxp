import { Edit, Plus, Trash2 } from "lucide-react";
import { cn } from "../../../utils/cn";

type Props = {
  id: number;
  title: string;
  code: string;
  level: string;
  createdAt: string;
  parcours: number;
  onSelect: (id: number) => void;
  onCreateParcours: (id: number) => void;
  onDelete: (id: number) => void;
};

const FormationCard = ({
  id,
  title,
  code,
  level,
  parcours,
  createdAt,
  onSelect,
  onCreateParcours,
  onDelete,
}: Props) => (
  <div className="group flex flex-col gap-y-2 p-5 rounded-lg bg-secondary/20 h-full">
    <span className="flex justify-between items-center">
      <h2 className="font-bold capitalize">{title}</h2>
      <span className="flex items-center gap-1">
        <button
          className="btn btn-ghost btn-xs"
          aria-label={`Modifier la formation ${title}`}
          onClick={() => onSelect(id)}
        >
          <Edit className="w-4 h-4 " />
        </button>
        <button
          className={cn("btn btn-ghost btn-xs btn-error disabled:opacity-30 ", {
            tooltip: parcours > 0,
          })}
          aria-label={`Supprimer la formation ${title}`}
          data-tip="Suppression impossible : des parcours sont associés"
          onClick={() => (parcours > 0 ? null : onDelete(id))}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </span>
    </span>
    <p>RNCP : {code}</p>
    <p>Niveau : {level}</p>
    <p>Parcours associés : {parcours}</p>
    <p>Créée le : {new Date(createdAt).toLocaleDateString("fr-FR")}</p>
    <button
      className="btn btn-secondary btn-sm self-end"
      aria-label={`Créer un parcours pour ${title}`}
      title="Créer un parcours associé"
      onClick={() => onCreateParcours(id)}
    >
      <Plus className="w-4 h-4" />
      Créer un parcours à partir de cette formation
    </button>
  </div>
);

export default FormationCard;
