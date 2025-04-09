import "./MenuItem.scss";

import remixiconUrl from "remixicon/fonts/remixicon.symbol.svg";

export default function MenuItem({
  icon,
  title,
  action,
  isActive = null,
}: {
  icon?: string;
  title?: string;
  action?: () => void;
  isActive?: (() => boolean) | null;
}) {
  return (
    <button
      className={`menu-item${isActive && isActive() ? " is-active bg-secondary fill-secondary-content" : ""} fill-base-content hover:bg-secondary hover:fill-secondary-content`}
      onClick={action}
      title={title}
    >
      <svg className="remix">
        <use xlinkHref={`${remixiconUrl}#ri-${icon}`} />
      </svg>
    </button>
  );
}
