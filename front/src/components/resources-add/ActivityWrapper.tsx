import { ReactNode } from "react";
import { Activity } from "../../utils/interfaces/activity";
import { getActivityIcon } from "../../helpers/getActivityIcon";
import { localeDate } from "../../helpers/locale-date";

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
      {(props.mode === "read" && props.activity) ||
      (props.mode === "edit" &&
        props.activity &&
        props.activity.type === "resource") ? (
        <div className="flex items-center gap-x-4 justify-start">
          <p className="whitespace-nowrap text-base-content/50">
            Titre de l'activité :&nbsp;
          </p>
          <span className="border border-primary/50 flex justify-between p-2 rounded-lg w-full">
            <div className="flex gap-x-4 items-center">
              {getActivityIcon(props.activity.type, 6)}
              <h2>{props.activity?.title}</h2>
            </div>
            <p className="italic text-base-content/50">
              &nbsp;ajouté le {localeDate(props.activity.createdAt)}
            </p>
          </span>
        </div>
      ) : null}
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
