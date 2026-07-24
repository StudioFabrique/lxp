import { Link } from "react-router";
import { type ReactNode } from "react";
import activityIconType from "../../../../../utils/helpers/activity-icon-type";
import type { Activity } from "../../../../../utils/interfaces/activity";

type Props = {
  title: string;
  activityType?: Activity["type"];
  titleEditable?: boolean;
  titleError?: string;
  onEditTitle?: (title: string) => void;
  titlePlaceholder?: string;
  onCancel?: () => void;
  cancelLabel?: string;
  cancelDisabled?: boolean;
  children?: ReactNode;
  className?: string;
  titleClassName?: string;
  inputClassName?: string;
};

const ActivityHeader = ({
  title,
  activityType,
  titleEditable = false,
  titleError,
  onEditTitle,
  titlePlaceholder = "Saisissez le titre de l'activité",
  onCancel,
  cancelLabel = "Annuler",
  cancelDisabled = false,
  children,
  className = "w-full flex justify-between items-center",
  titleClassName = "text-xl font-bold",
  inputClassName,
}: Props) => {
  return (
    <article className={className}>
      <div className="flex gap-3 items-center">
        {activityType && (
          <span className="w-6">{activityIconType(activityType)}</span>
        )}
        {titleEditable ? (
          <input
            type="text"
            value={title}
            onChange={(e) => onEditTitle?.(e.target.value)}
            className={`input input-bordered ${titleClassName} ${
              titleError && "input-error text-error"
            } ${inputClassName ?? ""}`}
            placeholder={titlePlaceholder}
            autoFocus
          />
        ) : (
          <h1 className={titleClassName}>{title}</h1>
        )}
      </div>
      {children ??
        (onCancel ? (
          <button
            onClick={onCancel}
            disabled={cancelDisabled}
            className="btn btn-warning"
          >
            {cancelLabel}
          </button>
        ) : (
          <Link className="btn btn-primary" to="..">
            Retour
          </Link>
        ))}
    </article>
  );
};

export default ActivityHeader;
