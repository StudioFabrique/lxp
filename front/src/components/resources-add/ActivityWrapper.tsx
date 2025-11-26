import { ReactNode } from "react";
import { Activity } from "../../utils/interfaces/activity";
import { EditIcon, Eye, Trash2 } from "lucide-react";

type Props = {
  children: ReactNode;
  activity: Activity | null;
  mode: "read" | "edit" | "write";
  onSwitchMode: (state: "read" | "edit") => void;
  onClose: () => void;
};

export default function ActivityWrapper(props: Props) {
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="p-1 pl-2 border border-primary/20 flex-1 mr-4 rounded-lg">
          {props.activity?.title ?? "Nouvelle activité"}
        </h2>
        <span className="flex gap-x-4">
          <button
            className="btn btn-circle btn-sm btn-primary tooltip tooltip-left"
            data-tip={
              props.mode === "read"
                ? "Passer en mode édition"
                : "Passer en mode lecture"
            }
            aria-label={
              props.mode === "read"
                ? "Passer en mode édition"
                : "Passer en mode lecture"
            }
            onClick={() =>
              props.onSwitchMode(props.mode === "read" ? "edit" : "read")
            }
          >
            {props.mode === "read" ? (
              <EditIcon className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
          <button
            className="btn btn-warning btn-circle btn-sm tooltip tooltip-left"
            data-tip="Supprimer l'activité"
            aria-label="Suppression de l'activité"
            disabled={!props.activity}
            onClick={() => {}}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </span>
      </div>
      {props.children}
      <>
        {props.mode === "read" ? (
          <div className="flex justify-end">
            <button
              className="btn btn-outline btn-primary mt-4"
              onClick={props.onClose}
            >
              Fermer
            </button>
          </div>
        ) : null}
      </>
    </>
  );
}
