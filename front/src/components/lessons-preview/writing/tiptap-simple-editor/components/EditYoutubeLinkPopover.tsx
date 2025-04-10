import * as Popover from "@radix-ui/react-popover";
import { Toolbar } from "./ui/Toolbar";
import { Icon } from "./ui/Icon";
import { YoutubeLinkEditorPanel } from "./YoutubeLinkEditorPanel";

export type EditYoutubeLinkPopoverProps = {
  onSetLink: (url: string, size?: "small" | "medium" | "large") => void;
};

export const EditYoutubeLinkPopover = ({
  onSetLink,
}: EditYoutubeLinkPopoverProps) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Toolbar.Button tooltip="Insérer un vidéo Youtube">
          <Icon name="Youtube" />
        </Toolbar.Button>
      </Popover.Trigger>
      <Popover.Content>
        <YoutubeLinkEditorPanel onSetLink={onSetLink} />
      </Popover.Content>
    </Popover.Root>
  );
};
