import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ExternalLink, MoreVertical } from "lucide-react";
import { type Key, type ReactNode } from "react";
import { Link, type LinkProps } from "react-router";

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
  action?: ReactNode | ((dismissOverflow: () => void) => ReactNode);
  ariaLabel?: string;
};

type HierarchicalListItemActionsProps = {
  title: string;
  to: LinkProps["to"];
  state?: LinkProps["state"];
  navigationLabel: string;
  dismissOverflow?: () => void;
};

export const HierarchicalListItemActions = ({
  title,
  to,
  state,
  navigationLabel,
  dismissOverflow = () => {},
}: HierarchicalListItemActionsProps) => (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger asChild>
      <button
        type="button"
        className="btn btn-square btn-sm btn-ghost"
        aria-label={`Actions pour ${title}`}
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
        <DropdownMenu.Item asChild onSelect={dismissOverflow}>
          <Link
            className="flex cursor-pointer items-center gap-2 rounded-field px-3 py-2 text-sm outline-none hover:bg-base-200 focus:bg-base-200 data-[highlighted]:bg-base-200"
            to={to}
            state={state}
          >
            <ExternalLink className="size-4" />
            {navigationLabel}
          </Link>
        </DropdownMenu.Item>
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
  const itemAction =
    typeof item.action === "function"
      ? item.action(dismissOverflow)
      : item.action;

  return (
    <li className="list-row relative mx-2 hover:bg-accent/2">
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
        <div className="relative z-20 ml-auto self-center justify-self-end">
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
