import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ExternalLink, MoreVertical } from "lucide-react";
import { type Key, type ReactNode, useState } from "react";
import { Link, type LinkProps } from "react-router";

import PermissionGuard from "../../guards/PermissionGuard";

export type HierarchicalListCardItem = {
  id: Key;
  title: string;
  titleAccessory?: ReactNode;
  description?: ReactNode;
  subDescription?: ReactNode;
  image?: {
    src: string;
    alt: string;
  };
  icon?: ReactNode;
  to?: LinkProps["to"];
  state?: LinkProps["state"];
  action?:
    | ReactNode
    | ((
        dismissOverflow: () => void,
        menuControl: HierarchicalListMenuControl,
      ) => ReactNode);
  ariaLabel?: string;
};

export type HierarchicalListMenuControl = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

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
  dismissOverflow = () => {},
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
        className="menu z-[100] w-max rounded-box border border-base-300 bg-base-100 p-2 shadow-lg"
      >
        {actions.map((action) => {
          const className = `flex w-full cursor-pointer items-center gap-2 rounded-field px-3 py-2 text-sm outline-none hover:bg-base-200 focus:bg-base-200 data-[highlighted]:bg-base-200 [&>svg]:size-4 ${
            action.destructive ? "text-error" : ""
          }`;
          const menuItem = (
            <DropdownMenu.Item
              key={action.label}
              asChild
              onSelect={() => {
                dismissOverflow();
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

export const HierarchicalListRow = ({
  item,
  dismissOverflow,
}: {
  item: HierarchicalListCardItem;
  dismissOverflow: () => void;
}) => {
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const menuControl = {
    open: isActionMenuOpen,
    onOpenChange: setIsActionMenuOpen,
  };
  const itemAction =
    typeof item.action === "function"
      ? item.action(dismissOverflow, menuControl)
      : item.action;

  return (
    <li
      className="list-row relative mx-2 hover:bg-accent/2"
      onContextMenu={(event) => {
        if (!itemAction) return;

        event.preventDefault();
        setIsActionMenuOpen(true);
      }}
    >
      {item.image ? (
        <div className="pointer-events-none relative z-10 self-center">
          <img
            src={item.image.src}
            alt={item.image.alt}
            className="size-10 rounded-lg object-cover"
          />
        </div>
      ) : item.icon ? (
        <div className="pointer-events-none relative z-10 flex size-10 items-center justify-center self-center rounded-lg text-primary [&>svg]:size-5">
          {item.icon}
        </div>
      ) : null}

      <div className="pointer-events-none relative z-10 list-col-grow min-w-0 self-center">
        {item.description ? (
          <div className="truncate text-xs font-light opacity-60">
            {item.description}
          </div>
        ) : null}
        <div className="block max-w-full text-left first-letter:uppercase">
          <div className="flex min-w-0 items-center gap-2">
            <div className="truncate font-semibold">{item.title}</div>
            {item.titleAccessory ? (
              <div className="shrink-0">{item.titleAccessory}</div>
            ) : null}
          </div>
        </div>

        {item.subDescription ? (
          <div className="truncate text-xs font-light opacity-60">
            {item.subDescription}
          </div>
        ) : null}
      </div>

      {itemAction || item.to ? (
        <div className="relative z-10 ml-auto self-center justify-self-end">
          {itemAction ??
            (item.to ? (
              <Link
                className="btn btn-square btn-sm btn-ghost"
                to={item.to}
                state={item.state}
                aria-label={item.ariaLabel ?? `Ouvrir ${item.title}`}
              >
                <ExternalLink className="size-[1.2em]" />
              </Link>
            ) : null)}
        </div>
      ) : null}

      {item.to ? (
        <Link
          className="absolute inset-0 z-0 rounded-box"
          to={item.to}
          state={item.state}
          aria-label={item.ariaLabel ?? `Ouvrir ${item.title}`}
        />
      ) : null}
    </li>
  );
};
