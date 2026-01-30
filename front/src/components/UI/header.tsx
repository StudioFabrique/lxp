/**
 * En tête pour les interfaces qui listent les groupes, les users, les parcours, etc...
 */

import { ReactNode } from "react";

interface HeaderProps {
  title: string;
  alternateBgColor?: boolean;
  successBgColor?: boolean;
  disabled?: boolean;
  description?: string;
  isSubHeader?: boolean;
  hasError?: boolean;
  classname?: string;
  onClick?: () => void;
  children?: ReactNode;
}

const Header = (props: HeaderProps) => {
  return (
    <div
      onClick={props.onClick}
      className={`w-full flex px-4 ${props.isSubHeader ? "py-2" : "py-4"} ${props.isSubHeader && !props.disabled ? "ring-1" : ""} ${props.hasError && "ring-2 ring-error"} items-center justify-between rounded-lg  ${props.alternateBgColor ? "bg-base-200" : props.successBgColor ? "bg-success" : "bg-secondary/20"} select-none ${props.disabled && "opacity-15 text-primary-content"} ${props.onClick ? "cursor-pointer hover:opacity-50" : ""}`}
    >
      <div>
        <h2
          className={`flex-1 ${props.isSubHeader ? "text-lg font-bold" : "text-xl font-extrabold"} ${props.classname}`}
        >
          {props.title}
        </h2>
        <p
          className={`${props.isSubHeader ? "text-[8.5pt]" : "text-xs"} ${props.hasError ? "text-error" : "text-base-content"} ${props.disabled ? " text-primary-content" : ""}`}
        >
          {props.description}
        </p>
      </div>
      <div className="flex justify-end items-center">{props.children}</div>
    </div>
  );
};

export default Header;
