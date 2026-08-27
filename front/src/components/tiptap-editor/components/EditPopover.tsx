import * as Popover from "@radix-ui/react-popover";
import { ReactNode } from "react";
import { ToolbarButton } from "./ui/Toolbar";

export type EditPopoverProps = {
  title?: string;
  icon: ReactNode;
  children: ReactNode;
};

export const EditPopover = ({ title, icon, children }: EditPopoverProps) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <ToolbarButton className="flex items-center gap-3 p-1.5 text-sm font-medium text-left bg-transparent w-full rounded select-none">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center text-base-content/60">
            {icon}
          </span>
          <span className="text-base-content/60 w-full">{title}</span>
        </ToolbarButton>
      </Popover.Trigger>
      <Popover.Content className="absolute left-[4.2rem] -top-10">
        {children}
      </Popover.Content>
    </Popover.Root>
  );
};
