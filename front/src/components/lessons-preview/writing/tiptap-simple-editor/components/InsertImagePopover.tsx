import * as Popover from "@radix-ui/react-popover";
import { Toolbar } from "./ui/Toolbar";
import { Icon } from "./ui/Icon";
import { InsertImagePanel } from "./InsertImagePanel";
import type { Dispatch, SetStateAction } from "react";
import { useState, useCallback } from "react";

export type InsertImagePopoverProps = {
  title?: string;
  onSetLink: (url: string) => void;
  onSetImageSize?: Dispatch<SetStateAction<"small" | "medium" | "large">>;
  onClickButton?: () => void;
};

export const InsertImagePopover = ({
  title,
  onSetLink,
  onSetImageSize,
  onClickButton,
}: InsertImagePopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSetLink = useCallback(
    (url: string) => {
      onSetLink(url);
      setIsOpen(false); // Fermer le popup après insertion
    },
    [onSetLink]
  );

  const handleClickButton = useCallback(() => {
    onClickButton?.();
    setIsOpen(false); // Fermer le popup après clic sur le bouton de téléversement
  }, [onClickButton]);

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <Toolbar.Button className="flex items-center gap-3.5 p-1.5 text-sm font-medium text-neutral-500 dark:text-neutral-400 text-left bg-transparent w-full max-w-max rounded hover:bg-neutral-100 hover:text-neutral-800 dark:hover:bg-neutral-900 dark:hover:text-neutral-200">
          <Icon name="PictureInPicture" />
          {title}
        </Toolbar.Button>
      </Popover.Trigger>
      <Popover.Content>
        <InsertImagePanel
          onSetLink={handleSetLink}
          onSetImageSize={onSetImageSize}
          onClickButton={handleClickButton}
        />
      </Popover.Content>
    </Popover.Root>
  );
};
