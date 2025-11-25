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
        <Toolbar.Button className="flex items-center gap-3 p-1.5 text-sm font-medium text-left bg-transparent w-full rounded select-none">
          <Icon className="text-base-content w-8" name="Youtube" />
          <span className="text-base-content w-full">{title}</span>
        </Toolbar.Button>
      </Popover.Trigger>
      <Popover.Content className="absolute left-[4.2rem] -top-10">
        <YoutubeLinkEditorPanel onSetLink={onSetLink} />
      </Popover.Content>
    </Popover.Root>
  );
};
