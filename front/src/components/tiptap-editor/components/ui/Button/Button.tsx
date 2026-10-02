import React from "react";
import { cn } from "../../../../../utils/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "quaternary"
  | "ghost";
export type ButtonSize = "medium" | "small" | "icon" | "iconSmall";

export type ButtonProps = {
  variant?: ButtonVariant;
  active?: boolean;
  activeClassname?: string;
  buttonSize?: ButtonSize;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const variantClasses: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-ghost",
  tertiary: "btn-soft btn-neutral",
  quaternary: "btn-outline",
  ghost: "btn-ghost text-base-content/60",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      active,
      buttonSize = "medium",
      children,
      disabled,
      variant = "primary",
      className,
      activeClassname,
      ...rest
    },
    ref,
  ) => {
    const buttonClassName = cn(
      "btn h-auto min-h-0 gap-2 rounded-md text-sm font-semibold normal-case disabled:opacity-50 whitespace-nowrap",
      variantClasses[variant],
      buttonSize === "medium" && "py-2 px-3",
      buttonSize === "small" && "py-1 px-2",
      buttonSize === "icon" && "w-8 h-8 p-0",
      buttonSize === "iconSmall" && "w-6 h-6 p-0",
      active && "btn-active",
      active && activeClassname,
      className,
    );

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={buttonClassName}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
