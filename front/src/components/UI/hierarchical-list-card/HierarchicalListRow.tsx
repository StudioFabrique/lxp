import { formatTitle } from "../../../utils/helpers/text-helpers";
import { ArrowUpRight, ExternalLink } from "lucide-react";
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

      {itemAction || item.to || item.onClick ? (
        <div
          className={cn("relative z-10 flex items-center gap-1 ml-auto self-center justify-self-end", item.onClick && "pointer-events-none")}
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

      {/* La ligne entière est cliquable : une flèche dans le coin haut droit, au-dessus des actions, le signale au survol ou quand le lien de la ligne a le focus clavier (pas quand une action, comme le menu, le garde après un clic). */}
      {item.to || item.onClick ? (
        <ArrowUpRight
          className="pointer-events-none absolute right-1 -top-2 z-10 size-3.5 translate-y-1 text-primary opacity-0 transition-all duration-200 ease-out group-hover/row:translate-y-0 group-hover/row:opacity-100 group-has-[[data-row-link]:focus-visible]/row:translate-y-0 group-has-[[data-row-link]:focus-visible]/row:opacity-100 motion-reduce:transition-none"
          aria-hidden="true"
        />
      ) : null}

      {item.to ? (
        <Link
          data-row-link
          className="absolute inset-0 z-0 cursor-pointer rounded-box"
          to={item.to}
          state={item.state}
          aria-label={item.ariaLabel ?? `Ouvrir ${formatTitle(item.title)}`}
        />
      ) : item.onClick ? (
        <button
          type="button"
          data-row-link
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
