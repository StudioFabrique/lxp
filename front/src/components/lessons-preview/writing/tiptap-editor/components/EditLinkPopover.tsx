import * as Popover from "@radix-ui/react-popover";
import { Icon } from "./ui/Icon";
import { LinkEditorPanel } from "./LinkEditorPanel";

export type EditLinkPopoverProps = {
  title?: string;
  onSetLink: (link: string, openInNewTab?: boolean) => void;
};

export const EditLinkPopover = ({ title, onSetLink }: EditLinkPopoverProps) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="flex items-center gap-3.5 p-1.5 text-sm font-medium text-left bg-transparent w-full max-w-max rounded"
        >
          <Icon className="text-base-content" name="Link" />
          <span className="text-base-content">{title}</span>
        </button>
      </Popover.Trigger>
      <Popover.Content>
        <LinkEditorPanel onSetLink={onSetLink} />
      </Popover.Content>
    </Popover.Root>
  );
};
