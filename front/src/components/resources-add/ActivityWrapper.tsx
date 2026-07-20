import { ReactNode } from "react";
import { Activity } from "../../../src/utils/interfaces/activity";
import activityIconType from "../../../src/utils/helpers/activity-icon-type";
import { localeDate } from "../../utils/helpers/locale-date";
import PermissionGuard from "../../components/guards/PermissionGuard";

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
          <PermissionGuard action="write" object="lesson">
            <p className="whitespace-nowrap text-base-content/50">
              Titre de l'activité :&nbsp;
            </p>
          </PermissionGuard>
          <span className="border border-primary/50 flex justify-between p-2 rounded-lg w-full items-center">
            <div className="flex gap-x-4 items-center">
              {activityIconType(
                props.activity.type,
                6,
              )}
              <h2>{props.activity?.title}</h2>
            </div>
            <p className="italic text-xs text-base-content/50">
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
