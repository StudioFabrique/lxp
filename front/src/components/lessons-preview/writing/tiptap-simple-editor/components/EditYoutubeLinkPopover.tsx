import * as Popover from "@radix-ui/react-popover";
import { Toolbar } from "./ui/Toolbar";
import { Icon } from "./ui/Icon";
import { YoutubeLinkEditorPanel } from "./YoutubeLinkEditorPanel";

export type EditYoutubeLinkPopoverProps = {
  title?: string;
  onSetLink: (url: string, size?: "small" | "medium" | "large") => void;
};

export const EditYoutubeLinkPopover = ({
  title,
  onSetLink,
}: EditYoutubeLinkPopoverProps) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Toolbar.Button className="flex items-center gap-3 p-1.5 text-sm font-medium text-neutral-500 dark:text-neutral-400 text-left bg-transparent w-full rounded hover:bg-neutral-100 hover:text-neutral-800 dark:hover:bg-neutral-900 dark:hover:text-neutral-200">
          <Icon name="Youtube" />
          {title}
        </Toolbar.Button>
      </Popover.Trigger>
      <Popover.Content>
        <YoutubeLinkEditorPanel onSetLink={onSetLink} />
      </Popover.Content>
    </Popover.Root>
  );
};
