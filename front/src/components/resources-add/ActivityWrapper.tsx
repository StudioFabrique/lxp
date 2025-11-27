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
      {props.mode === "read" && props.activity ? (
        <div className="border border-primary/50 p-2 rounded-lg flex items-center gap-x-4 justify-start">
          {getActivityIcon(props.activity.type, 6)}
          <span className="flex justify-between w-full">
            <h2>{props.activity?.title}</h2>
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
