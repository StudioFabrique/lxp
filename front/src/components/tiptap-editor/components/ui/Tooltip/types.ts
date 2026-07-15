import type { ReactNode } from "react";
import type { TooltipContentProps } from "@radix-ui/react-tooltip";

export interface TooltipOptions {
  align?: TooltipContentProps["align"];
  avoidCollisions?: TooltipContentProps["avoidCollisions"];
  collisionPadding?: TooltipContentProps["collisionPadding"];
  delayDuration?: number;
  side?: TooltipContentProps["side"];
  sideOffset?: number;
}

export interface TooltipProps {
  children?: string | ReactNode;
  enabled?: boolean;
  title?: string;
  shortcut?: string[];
  tippyOptions?: TooltipOptions;
  content?: ReactNode;
}
