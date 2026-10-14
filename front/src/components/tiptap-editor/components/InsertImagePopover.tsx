import * as Popover from "@radix-ui/react-popover";
import { ToolbarButton } from "./ui/Toolbar";
import { Icon } from "./ui/Icon";
import { InsertImagePanel } from "./InsertImagePanel";
import type { UrlEditorSize } from "./useUrlEditorState";
import { useState, useCallback } from "react";

export type InsertImagePopoverProps = {
  title?: string;
  onSetLink: (url: string, size: UrlEditorSize) => void;
  initialSize?: UrlEditorSize;
  onClickUpload?: (size: UrlEditorSize) => void;
};

export const InsertImagePopover = ({
  title,
  onSetLink,
  initialSize,
  onClickUpload,
}: InsertImagePopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSetLink = useCallback(
    (url: string, size: UrlEditorSize) => {
      onSetLink(url, size);
      setIsOpen(false);
    },
    [onSetLink]
  );

  const handleClickUpload = useCallback((size: UrlEditorSize) => {
    onClickUpload?.(size);
    setIsOpen(false);
  }, [onClickUpload]);

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <ToolbarButton
          type="button"
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
      <Popover.Portal>
      <Popover.Content aria-label="Insérer une image" side="bottom" align="start" sticky="always" sideOffset={8} collisionPadding={12}
        className="z-50 w-80 max-w-[calc(100vw-1.5rem)] max-h-[var(--radix-popover-content-available-height)] overflow-y-auto rounded-xl border border-base-300 bg-base-100 p-4 shadow-xl">
        <InsertImagePanel
          onSetLink={handleSetLink}
          initialSize={initialSize}
          onClickUpload={handleClickUpload}
        />
      </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
