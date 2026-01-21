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
  hasError?: boolean;
  classname?: string;
  children?: ReactNode;
}

const Header = (props: HeaderProps) => {
  return (
    <div
      className={`w-full flex ${props.hasError && "border-2 border-error"} items-center justify-between p-4 rounded-lg  ${props.alternateBgColor ? "bg-base-200" : props.successBgColor ? "bg-success" : "bg-secondary/20"} select-none ${props.disabled && "opacity-15"}`}
    >
      <div>
        <h2
          className={`flex-1 text-xl font-extrabold capitalize ${props.classname}`}
        >
          {props.title}
        </h2>
        <p
          className={`text-xs ${props.hasError ? "text-error" : "text-base-content"}`}
        >
          {props.description}
        </p>
      </div>
      <div className="flex justify-end items-center">{props.children}</div>
    </div>
  );
};

export default Header;
