import { ReactNode } from "react";
import { Activity } from "../../utils/interfaces/activity";
import { EditIcon, Eye, Trash } from "lucide-react";

type Props = {
  children: ReactNode;
  activity: Activity | null;
  mode: "read" | "edit" | "write";
  onSwitchMode: (state: "read" | "edit") => void;
};

export default function ActivityWrapper(props: Props) {
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="p-1 pl-2 border border-primary/20 flex-1 mr-4 rounded-lg">
          {props.activity?.title ?? "Nouvelle activité"}
        </h2>
        <span className="flex gap-x-2">
          <button
            className="btn btn-circle btn-sm btn-primary"
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
            className="btn btn-warning btn-circle btn-sm"
            onClick={() => {}}
          >
            <Trash className="w-4 h-4" />
          </button>
        </span>
      </div>
      {props.children}
    </>
  );
}
