import { TIPTAP_MENU_BAR_COLORS } from "../Menubar/MenuBarConfig";
import { Icon } from "../ui/Icon";
import { Surface } from "../ui/Surface";
import { ToolbarButton, ToolbarDivider } from "../ui/Toolbar";
import Tooltip from "../ui/Tooltip";

export type LinkPreviewPanelProps = {
  url: string;
  onEdit: () => void;
  onClear: () => void;
};

export const LinkPreviewPanel = ({
  onClear,
  onEdit,
  url,
}: LinkPreviewPanelProps) => {
  const sanitizedLink = url?.startsWith("javascript:") ? "" : url;
  return (
    <Surface
      className={`flex items-center gap-2 p-2 ${TIPTAP_MENU_BAR_COLORS.background} ${TIPTAP_MENU_BAR_COLORS.text} select-none`}
    >
      <a
        href={sanitizedLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm underline break-all"
      >
        {url}
      </a>
      <ToolbarDivider />
      <Tooltip title="Edit link">
        <ToolbarButton onClick={onEdit}>
          <Icon name="Pen" />
        </ToolbarButton>
      </Tooltip>
      <Tooltip title="Remove link">
        <ToolbarButton onClick={onClear}>
          <Icon name="Trash2" />
        </ToolbarButton>
      </Tooltip>
    </Surface>
  );
};
