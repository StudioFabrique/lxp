import { useState, type ReactNode } from "react";

import { cn } from "../../../utils/cn";
import CursorGlowCard from "../cursor-glow-card";
import Modal from "../modal/modal";
import {
  HierarchicalListCardItem,
  HierarchicalListRow,
} from "./HierarchicalListRow";

type HierarchicalListCardProps = {
  label?: string;
  title?: string;
  truncateTitle?: boolean;
  description?: ReactNode;
  action?: ReactNode;
  items?: HierarchicalListCardItem[];
  maxItemsShown?: number;
  showMore?: boolean;
  emptyMessage?: string;
  moreItemsLabel?: (remainingItemsCount: number) => string;
  overflowTitle?: string;
  footer?: ReactNode;
  placeholder?: ReactNode;
  fullWidth?: boolean;
};

const HierarchicalListCard = ({
  label,
  title,
  truncateTitle,
  description,
  action,
  items = [],
  maxItemsShown = 4,
  showMore = true,
  emptyMessage = "Aucun élément associé",
  moreItemsLabel = (remainingItemsCount) =>
    `Afficher plus (${remainingItemsCount})`,
  overflowTitle = title ? `Autres éléments de ${title}` : "Autres éléments",
  footer,
  placeholder,
  fullWidth = false,
}: HierarchicalListCardProps) => {
  const [showRemainingItems, setShowRemainingItems] = useState(false);
  const visibleItems = items.slice(0, maxItemsShown);
  const remainingItems = items.slice(maxItemsShown);
  const hasHeader = Boolean(title);

  return (
    <>
      <CursorGlowCard
        glowColor="secondary"
        glowSize={2.4}
        className={cn("rounded-box", { "h-full": !fullWidth })}
      >
        <ul
          className={cn(
            "list overflow-hidden rounded-box border border-base-300",
            {
              "h-full min-h-52": !fullWidth,
              "border-dashed border-primary/25": !hasHeader,
              "bg-base-200": hasHeader,
            },
          )}
        >
          {hasHeader ? (
            <>
              <li className="p-4 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    {label ? (
                      <p className="select-none text-xs tracking-wide opacity-60">
                        {label}
                      </p>
                    ) : null}
                    <h4
                      className={cn(
                        "first-letter:uppercase text-xl font-bold",
                        { truncate: truncateTitle },
                      )}
                    >
                      {title}
                    </h4>
                    {description ? (
                      <div className="mt-1 text-xs opacity-60">
                        {description}
                      </div>
                    ) : null}
                  </div>
                  {action ? <div className="shrink-0">{action}</div> : null}
                </div>
              </li>

              {visibleItems.map((item) => (
                <HierarchicalListRow
                  key={item.id}
                  item={item}
                  showTitleTooltip={!fullWidth}
                  dismissOverflow={() => {}}
                />
              ))}

              {items.length === 0 ? (
                <li className="flex flex-1 items-center justify-center px-5 py-8 text-sm opacity-60 select-none">
                  {emptyMessage}
                </li>
              ) : null}

              {showMore && remainingItems.length > 0 ? (
                <li className="flex justify-center px-5 py-3">
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost text-primary"
                    onClick={() => setShowRemainingItems(true)}
                  >
                    {moreItemsLabel(remainingItems.length)}
                  </button>
                </li>
              ) : null}

              {footer ? (
                <li
                  className={cn("flex flex-col items-center gap-2 py-5", {
                    "mt-auto": items.length > 0,
                    "flex-1 justify-center": items.length === 0,
                  })}
                >
                  {footer}
                </li>
              ) : null}
            </>
          ) : (
            <li className="flex flex-1 items-center justify-center p-6">
              {placeholder}
            </li>
          )}
        </ul>
      </CursorGlowCard>

      {showMore && showRemainingItems ? (
        <Modal
          title={overflowTitle}
          leftLabel="Fermer"
          onLeftClick={() => setShowRemainingItems(false)}
          modalBoxStyle="max-w-2xl"
          dialogAdditionalClass="z-20"
        >
          <ul className="list mt-5 overflow-hidden rounded-box border border-base-300 bg-base-200">
            {remainingItems.map((item) => (
              <HierarchicalListRow
                key={item.id}
                item={item}
                showTitleTooltip={false}
                dismissOverflow={() => setShowRemainingItems(false)}
              />
            ))}
          </ul>
        </Modal>
      ) : null}
    </>
  );
};

export default HierarchicalListCard;
