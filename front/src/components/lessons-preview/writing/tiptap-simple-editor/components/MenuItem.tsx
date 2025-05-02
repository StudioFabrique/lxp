import "./MenuItem.scss";

import remixiconUrl from "remixicon/fonts/remixicon.symbol.svg";

export default function MenuItem({
  icon,
  title,
  action,
  isActive = null,
  color,
  disabled,
}: {
  icon?: string;
  title?: string;
  showTitle?: boolean;
  action?: () => void;
  isActive?: (() => boolean) | null;
  color?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className={`menu-item${isActive?.() ? " is-active bg-secondary fill-secondary-content" : ""} ${color === "info" ? "fill-info" : "fill-base-content"}  hover:bg-base-300 tooltip disabled:opacity-50`}
      data-tip={title}
      onClick={action}
      title={title}
      disabled={disabled}
    >
      <svg className="remix">
        <use xlinkHref={`${remixiconUrl}#ri-${icon}`} />
      </svg>
    </button>
  );
}
