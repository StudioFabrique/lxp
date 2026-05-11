import React from "react";
import { cn } from "../../../../../../utils";
import { TIPTAP_MENU_BAR_COLORS } from "../../Menubar/MenuBarConfig";

export const DropdownCategoryTitle = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div
      className={`text-[.65rem] font-semibold mb-1 uppercase ${TIPTAP_MENU_BAR_COLORS.text} select-none px-1.5`}
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
    "flex items-center gap-2 p-1.5 text-sm font-medium text-left bg-transparent w-full rounded",
    !isActive && !disabled,
    "hover:bg-neutral-100",
    isActive && !disabled && "bg-neutral-100",
    disabled && "cursor-not-allowed dark:text-neutral-600",
    TIPTAP_MENU_BAR_COLORS.text,
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
