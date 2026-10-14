import { formatTitle } from "../../../utils/helpers/text-helpers";
import { ExternalLink } from "lucide-react";
import { type Key, type ReactNode, useState } from "react";
import { Link, type LinkProps } from "react-router";
import { cn } from "../../../utils/cn";
import { type HierarchicalListMenuControl } from "./HierarchicalListRow.types";

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
  onClick?: () => void;
  action?:
    | ReactNode
    | ((
        dismissOverflow: () => void,
        menuControl: HierarchicalListMenuControl,
      ) => ReactNode);
  ariaLabel?: string;
};

export const HierarchicalListRow = ({
  item,
  dismissOverflow,
  hideDivider = false,
}: {
  item: HierarchicalListCardItem;
  dismissOverflow?: () => void;
  hideDivider?: boolean;
}) => {
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const menuControl = {
    open: isActionMenuOpen,
    onOpenChange: setIsActionMenuOpen,
  };
  const handleDismissOverflow = () => {
    setIsActionMenuOpen(false);
    dismissOverflow?.();
  };
  const itemAction =
    typeof item.action === "function"
      ? item.action(handleDismissOverflow, menuControl)
      : item.action;

  return (
    <li
      className={cn("group/row list-row relative mx-2 hover:bg-accent/2", (item.to || item.onClick) && "cursor-pointer", hideDivider && "after:hidden")}
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
          <div className="truncate text-xs text-base-content/80">
            {item.description}
          </div>
        ) : null}
        <div className="block max-w-full text-left first-letter:uppercase">
          <div className="flex min-w-0 items-center gap-2">
            <div className="truncate font-semibold">{formatTitle(item.title)}</div>
            {item.titleAccessory ? (
              <div className="shrink-0">{item.titleAccessory}</div>
            ) : null}
          </div>
        </div>

        {item.subDescription ? (
          <div className="truncate text-xs text-base-content/80">
            {item.subDescription}
          </div>
        ) : null}
      </div>

      {itemAction || item.to ? (
        <div
          className={cn("relative z-10 ml-auto self-center justify-self-end", item.onClick && "pointer-events-none")}
        >
          {itemAction ??
            (item.to ? (
              <Link
                className="btn btn-square btn-sm btn-ghost"
                to={item.to}
                state={item.state}
                aria-label={item.ariaLabel ?? `Ouvrir ${formatTitle(item.title)}`}
              >
                <ExternalLink className="size-[1.2em]" />
              </Link>
            ) : null)}
        </div>
      ) : null}

      {item.to ? (
        <Link
          className="absolute inset-0 z-0 cursor-pointer rounded-box"
          to={item.to}
          state={item.state}
          aria-label={item.ariaLabel ?? `Ouvrir ${formatTitle(item.title)}`}
        />
      ) : item.onClick ? (
        <button
          type="button"
          className="absolute inset-0 z-0 cursor-pointer rounded-box"
          onClick={item.onClick}
          aria-label={item.ariaLabel ?? `Ouvrir ${formatTitle(item.title)}`}
        />
      ) : null}
    </li>
  );
};

export { type HierarchicalListMenuControl } from "./HierarchicalListRow.types";
export { type HierarchicalListAction, HierarchicalListItemActions } from "./HierarchicalListItemActions";
