import {
  Bold,
  Italic,
  Redo2,
  RemoveFormatting,
  SeparatorHorizontal,
  Sparkles,
  SquareCode,
  Strikethrough,
  Undo2,
  type LucideIcon,
} from "lucide-react";
import { TIPTAP_MENU_BAR_COLORS } from "./MenuBarConfig";
import "./MenuItem.scss";

const menuIcons: Partial<Record<string, LucideIcon>> = {
  "arrow-go-back-line": Undo2,
  "arrow-go-forward-line": Redo2,
  "bard-line": Sparkles,
  bold: Bold,
  "code-box-line": SquareCode,
  "format-clear": RemoveFormatting,
  italic: Italic,
  separator: SeparatorHorizontal,
  strikethrough: Strikethrough,
};

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
  const IconComponent = icon ? menuIcons[icon] : undefined;
  const itemIsActive = isActive?.() ?? false;

  return (
    <button
      type="button"
      className={`menu-item ${
        itemIsActive
          ? `is-active ${TIPTAP_MENU_BAR_COLORS.textActive} ${TIPTAP_MENU_BAR_COLORS.backgroundActive}`
          : color === "info"
            ? "fill-info text-info"
            : "fill-base-content text-base-content"
      } tooltip disabled:opacity-50`}
      aria-label={title || icon || "Editor action"}
      data-tip={title}
      onClick={action}
      title={title}
      disabled={disabled}
    >
      {IconComponent && <IconComponent aria-hidden="true" strokeWidth={2.5} />}
    </button>
  );
}
