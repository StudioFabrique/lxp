import { TIPTAP_MENU_BAR_COLORS } from "./MenuBarConfig";
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
  action?: () => void;
  isActive?: (() => boolean) | null;
  color?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className={`menu-item ${
        isActive?.()
          ? `is-active ${TIPTAP_MENU_BAR_COLORS.textActive} ${TIPTAP_MENU_BAR_COLORS.backgroundActive}`
          : TIPTAP_MENU_BAR_COLORS.text
      } ${color === "info" ? "fill-info" : "fill-base-content"}  hover:${
        TIPTAP_MENU_BAR_COLORS.backgroundActive
      } tooltip disabled:opacity-50`}
      data-tip={title}
      onClick={action}
      title={title}
      disabled={disabled}
    >
      <svg
        className="remix"
        aria-hidden="true"
        role="img"
        aria-label={title || "Icon"}
      >
        <use xlinkHref={`${remixiconUrl}#ri-${icon}`} />
      </svg>
    </button>
  );
}
