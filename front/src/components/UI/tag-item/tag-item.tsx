import type { CSSProperties, FC } from "react";
import { X } from "lucide-react";

import type Tag from "../../../utils/interfaces/tag";
import { cn } from "../../../utils/cn";

type TagItemProps = {
  tag: Tag;
  noIcon?: boolean;
  disabled?: boolean;
  compact?: boolean;
  onClick?: () => void;
};

const TagItem: FC<TagItemProps> = ({
  tag,
  noIcon = false,
  disabled = false,
  compact = false,
  onClick,
}) => {
  const style: CSSProperties = {
    backgroundColor: `color-mix(in srgb, ${tag.color} 45%, white)`,
    color: "#17202a",
  };
  const className = cn(
    "inline-flex items-center gap-2 rounded-lg border border-black/10 font-bold leading-5",
    compact ? "px-2.5 py-1 text-xs" : "min-h-8 px-4 py-1 text-sm",
    onClick && !disabled ? "cursor-pointer hover:brightness-95" : "cursor-default",
  );
  const content = (
    <>
      <span>#{tag.name}</span>
      {onClick && !noIcon && !disabled && (
        <X className="size-3.5 shrink-0 opacity-70" aria-hidden="true" />
      )}
    </>
  );

  if (!onClick || disabled) {
    return <span className={className} style={style}>{content}</span>;
  }

  return (
    <button type="button" className={className} style={style} onClick={onClick}>
      {content}
    </button>
  );
};

export default TagItem;
