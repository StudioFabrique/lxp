import React from "react";
import { cn } from "../../../../../utils/cn";

export const DropdownCategoryTitle = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div
      className="text-[.65rem] font-semibold mb-1 uppercase text-base-content/40 select-none px-2 tracking-wider"
    >
      {children}
    </div>
  );
};

export const DropdownButton = React.forwardRef<
  HTMLButtonElement,
  {
    children: React.ReactNode;
    isActive?: boolean;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
  }
>(function DropdownButtonInner(
  { children, isActive, onClick, disabled, className },
  ref,
) {
  const buttonClass = cn(
    "flex items-center gap-2 p-2 text-sm font-medium text-left w-full rounded-lg",
    "transition-all duration-150 ease-in-out",
    !isActive && !disabled && "hover:bg-base-200 text-base-content/70 hover:text-base-content",
    isActive && !disabled && "bg-primary/10 text-primary font-semibold",
    disabled && "cursor-not-allowed opacity-40",
    className,
  );

  return (
    <button
      className={buttonClass}
      disabled={disabled}
      onClick={onClick}
      ref={ref}
    >
      {children}
    </button>
  );
});
