import * as Popover from "@radix-ui/react-popover";
import { ToolbarButton } from "./ui/Toolbar";
import { Icon } from "./ui/Icon";
import { InsertImagePanel } from "./InsertImagePanel";
import type { Dispatch, SetStateAction } from "react";
import { useState, useCallback } from "react";

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
      setIsOpen(false);
    },
    [onSetLink]
  );

  const handleClickUpload = useCallback(() => {
    onClickUpload?.();
    setIsOpen(false);
  }, [onClickUpload]);

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <ToolbarButton
          className="flex w-full max-w-max items-center gap-3 rounded bg-transparent p-1.5 text-left text-sm font-medium select-none"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center text-base-content/60">
            <Icon className="h-5 w-5" name="PictureInPicture" />
          </span>
          <span className="w-full text-base-content/60">
            {title}
          </span>
        </ToolbarButton>
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
