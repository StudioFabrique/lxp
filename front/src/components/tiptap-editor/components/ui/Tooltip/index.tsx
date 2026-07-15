"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { JSX } from "react";

import { TooltipProps } from "./types";

const isMac =
  typeof window !== "undefined"
    ? navigator.platform.toUpperCase().indexOf("MAC") >= 0
    : false;

const ShortcutKey = ({ children }: { children: string }): JSX.Element => {
  const className =
    "inline-flex items-center justify-center w-5 h-5 p-1 text-[0.625rem] rounded font-semibold leading-none border border-neutral-200 text-neutral-500 border-b-2";

  if (children === "Mod") {
    return <kbd className={className}>{isMac ? "⌘" : "Ctrl"}</kbd>; // ⌃
  }

  if (children === "Shift") {
    return <kbd className={className}>⇧</kbd>;
  }

  if (children === "Alt") {
    return <kbd className={className}>{isMac ? "⌥" : "Alt"}</kbd>;
  }

  return <kbd className={className}>{children}</kbd>;
};

const Tooltip = ({
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
              className="z-[99999] flex items-center gap-2 rounded-lg border border-neutral-100 bg-white px-2.5 py-1 shadow-sm"
            >
              {content}
              {title && (
                <span className="text-xs font-medium text-neutral-500">
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

export default Tooltip;
