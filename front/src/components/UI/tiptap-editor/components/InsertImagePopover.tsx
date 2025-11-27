import * as Popover from "@radix-ui/react-popover";
import { Toolbar } from "./ui/Toolbar";
import { Icon } from "./ui/Icon";
import { InsertImagePanel } from "./InsertImagePanel";
import type { Dispatch, SetStateAction } from "react";
import { useState, useCallback } from "react";
import { TIPTAP_MENU_BAR_COLORS } from "./Menubar/MenuBarConfig";

export type InsertImagePopoverProps = {
  title?: string;
  onSetLink: (url: string) => void;
  onSetImageSize?: Dispatch<SetStateAction<"small" | "medium" | "large">>;
  onClickUpload?: () => void;
};

export const InsertImagePopover = ({
  title,
  onSetLink,
  onSetImageSize,
  onClickUpload,
}: InsertImagePopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSetLink = useCallback(
    (url: string) => {
      onSetLink(url);
      setIsOpen(false); // Fermer le popup après insertion
    },
    [onSetLink]
  );

  const handleClickUpload = useCallback(() => {
    onClickUpload?.();
    setIsOpen(false); // Fermer le popup après clic sur le bouton de téléversement
  }, [onClickUpload]);

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <Toolbar.Button
          className={`flex items-center gap-3.5 p-1.5 text-sm font-medium text-left bg-transparent w-full max-w-max rounded select-none`}
        >
          <Icon
            className={`${TIPTAP_MENU_BAR_COLORS.text} w-8`}
            name="PictureInPicture"
          />
          <span className={`${TIPTAP_MENU_BAR_COLORS.text} w-full`}>
            {title}
          </span>
        </Toolbar.Button>
      </Popover.Trigger>
      <Popover.Content className="absolute left-[4.6rem] -top-10">
        <InsertImagePanel
          onSetLink={handleSetLink}
          onSetImageSize={onSetImageSize}
          onClickUpload={handleClickUpload}
        />
      </Popover.Content>
    </Popover.Root>
  );
};
