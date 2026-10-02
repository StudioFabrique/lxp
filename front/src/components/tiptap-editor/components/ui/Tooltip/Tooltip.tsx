"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { JSX } from "react";
import { TooltipProps } from "./types";
import { ShortcutKey } from "./ShortcutKey";

export const Tooltip = ({
  children,
  enabled = true,
  title,
  shortcut,
  content,
  tippyOptions = {},
}: TooltipProps): JSX.Element => {
  if (enabled) {
    const {
      align = "center",
      avoidCollisions,
      collisionPadding,
      delayDuration = 500,
      side = "top",
      sideOffset = 8,
    } = tippyOptions;

    return (
      <TooltipPrimitive.Provider>
        <TooltipPrimitive.Root
          delayDuration={delayDuration}
          disableHoverableContent
        >
          <TooltipPrimitive.Trigger asChild>
            <span className="inline-flex">{children}</span>
          </TooltipPrimitive.Trigger>
          <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
              align={align}
              avoidCollisions={avoidCollisions}
              collisionPadding={collisionPadding}
              side={side}
              sideOffset={sideOffset}
              className="z-[99999] flex items-center gap-2 rounded-lg border border-base-300 bg-base-100 text-base-content px-2.5 py-1 shadow-sm"
            >
              {content}
              {title && (
                <span className="text-xs font-medium text-base-content/60">
                  {title}
                </span>
              )}
              {shortcut && (
                <span className="flex items-center gap-0.5">
                  {shortcut.map((shortcutKey) => (
                    <ShortcutKey key={shortcutKey}>{shortcutKey}</ShortcutKey>
                  ))}
                </span>
              )}
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
      </TooltipPrimitive.Provider>
    );
  }

  return <>{children}</>;
};
