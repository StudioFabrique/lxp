import * as Popover from "@radix-ui/react-popover";
import { Icon } from "./ui/Icon";
import { LinkEditorPanel } from "./LinkEditorPanel";
import { Toolbar } from "./ui/Toolbar";
import { TIPTAP_MENU_BAR_COLORS } from "./Menubar/MenuBarConfig";

export type EditLinkPopoverProps = {
  title?: string;
  onSetLink: (link: string, openInNewTab?: boolean) => void;
};

export const EditLinkPopover = ({ title, onSetLink }: EditLinkPopoverProps) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Toolbar.Button className="flex items-center gap-3 p-1.5 text-sm font-medium text-left bg-transparent w-full rounded select-none">
          <Icon className={`${TIPTAP_MENU_BAR_COLORS.text} w-8`} name="Link" />
          <span className={`${TIPTAP_MENU_BAR_COLORS.text} w-full`}>
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
