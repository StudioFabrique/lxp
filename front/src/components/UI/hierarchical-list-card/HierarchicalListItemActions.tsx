import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreVertical } from "lucide-react";
import { type ReactNode } from "react";
import { Link, type LinkProps } from "react-router";
import PermissionGuard from "../../guards/PermissionGuard";
import { cn } from "../../../utils/cn";
import { type HierarchicalListMenuControl } from "./HierarchicalListRow.types";

export type HierarchicalListAction = {
  label: string;
  icon: ReactNode;
  to?: LinkProps["to"];
  state?: LinkProps["state"];
  onSelect?: () => void;
  destructive?: boolean;
  permission?: {
    action: string;
    object: string;
  };
};

type HierarchicalListItemActionsProps = {
  title: string;
  actions: HierarchicalListAction[];
  dismissOverflow?: () => void;
  menuControl?: HierarchicalListMenuControl;
};

export const HierarchicalListItemActions = ({
  title,
  actions,
  dismissOverflow,
  menuControl,
}: HierarchicalListItemActionsProps) => (
  <DropdownMenu.Root
    open={menuControl?.open}
    onOpenChange={menuControl?.onOpenChange}
  >
    <DropdownMenu.Trigger asChild>
      <button
        type="button"
        className="btn btn-square btn-sm btn-ghost"
        aria-label={`Actions pour ${title}`}
        data-actions-count={actions.length}
      >
        <MoreVertical className="size-[1.2em]" />
      </button>
    </DropdownMenu.Trigger>

    <DropdownMenu.Portal>
      <DropdownMenu.Content
        align="end"
        sideOffset={4}
        className="menu z-100 w-max rounded-box border border-base-300 bg-base-100 p-2 shadow-lg"
      >
        {actions.map((action) => {
          const className = cn("flex w-full cursor-pointer items-center gap-2 rounded-field px-3 py-2 text-sm outline-none hover:bg-base-200 focus:bg-base-200 data-[highlighted]:bg-base-200 [&>svg]:size-4", action.destructive && "text-error");
          const menuItem = (
            <DropdownMenu.Item
              key={action.label}
              asChild
              onSelect={() => {
                dismissOverflow?.();
                action.onSelect?.();
              }}
            >
              {action.to ? (
                <Link className={className} to={action.to} state={action.state}>
                  {action.icon}
                  {action.label}
                </Link>
              ) : (
                <button type="button" className={className}>
                  {action.icon}
                  {action.label}
                </button>
              )}
            </DropdownMenu.Item>
          );

          return action.permission ? (
            <PermissionGuard
              key={action.label}
              action={action.permission.action}
              object={action.permission.object}
            >
              {menuItem}
            </PermissionGuard>
          ) : (
            menuItem
          );
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);
