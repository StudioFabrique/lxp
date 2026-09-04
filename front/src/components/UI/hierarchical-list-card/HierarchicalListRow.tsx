import { ExternalLink } from "lucide-react";
import { Key, ReactNode } from "react";
import { Link, LinkProps } from "react-router";
import { cn } from "../../../utils/cn";

export type HierarchicalListCardItem = {
  id: Key;
  title: string;
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

export const HierarchicalListRow = ({
  item,
  showTitleTooltip,
  dismissOverflow,
}: {
  item: HierarchicalListCardItem;
  showTitleTooltip: boolean;
  dismissOverflow: () => void;
}) => {
  const itemAction =
    typeof item.action === "function"
      ? item.action(dismissOverflow)
      : item.action;

  return (
    <Link to={item.to ?? "."} className="list-row hover:bg-accent/2 mx-2">
      {item.image ? (
        <div className="self-center">
          <img
            src={item.image.src}
            alt={item.image.alt}
            className="size-10 rounded-lg object-cover"
          />
        </div>
      ) : item.icon ? (
        <div className="flex size-10 items-center justify-center self-center rounded-lg text-primary [&>svg]:size-5">
          {item.icon}
        </div>
      ) : null}

      <div className="list-col-grow min-w-0 self-center">
        {item.description ? (
          <div className="truncate text-xs font-light opacity-60">
            {item.description}
          </div>
        ) : null}
        <div
          className={cn("block max-w-full text-left first-letter:uppercase")}
          data-tip={showTitleTooltip ? item.title : undefined}
        >
          <div className="truncate font-semibold">{item.title}</div>
        </div>

        {item.subDescription ? (
          <div className="truncate text-xs font-light opacity-60">
            {item.subDescription}
          </div>
        ) : null}
      </div>

      {itemAction ??
        (item.to ? (
          <Link
            className="btn btn-square btn-sm btn-ghost self-center"
            to={item.to}
            state={item.state}
            aria-label={item.ariaLabel ?? `Ouvrir ${item.title}`}
          >
            <ExternalLink className="size-[1.2em]" />
          </Link>
        ) : null)}
    </Link>
  );
};
