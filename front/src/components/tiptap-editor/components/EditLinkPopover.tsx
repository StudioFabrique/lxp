import { Icon } from "./ui/Icon";
import { LinkEditorPanel } from "./LinkEditorPanel";
import { EditPopover } from "./EditPopover";

export type EditLinkPopoverProps = {
  title?: string;
  onSetLink: (link: string, openInNewTab?: boolean) => void;
};

export const EditLinkPopover = ({ title, onSetLink }: EditLinkPopoverProps) => {
  return (
    <EditPopover
      title={title}
      icon={<Icon className="h-5 w-5 text-base-content/60" name="Link" />}
    >
      <LinkEditorPanel onSetLink={onSetLink} />
    </EditPopover>
  );
};
