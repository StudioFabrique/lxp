import * as Popover from "@radix-ui/react-popover";
import { Icon } from "./ui/Icon";
import { LinkEditorPanel } from "./LinkEditorPanel";
import { Toolbar } from "./ui/Toolbar";

export type EditLinkPopoverProps = {
  title?: string;
  onSetLink: (link: string, openInNewTab?: boolean) => void;
};

export const EditLinkPopover = ({ title, onSetLink }: EditLinkPopoverProps) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Toolbar.Button className="flex items-center gap-3 p-1.5 text-sm font-medium text-left bg-transparent w-full rounded select-none">
          <Icon className="text-base-content/60 w-8" name="Link" />
          <span className="text-base-content/60 w-full">
            {title}
          </span>
        </Toolbar.Button>
      </Popover.Trigger>
      <Popover.Content className="absolute left-[4.2rem] -top-10">
        <LinkEditorPanel onSetLink={onSetLink} />
      </Popover.Content>
    </Popover.Root>
  );
};
