/**
 * En tête pour les interfaces qui listent les groupes, les users, les parcours, etc...
 */

import { ReactNode, useMemo } from "react";

interface HeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

const Header = (props: HeaderProps) => {
  const baseStyle = useMemo(() => {
    return props.children
      ? "w-full flex-1 flex justify-between items-center p-4 rounded-lg bg-secondary/20 mr-8"
      : "w-full flex-1 flex items-start p-4 rounded-lg bg-secondary/20";
  }, [props.children]);

  return (
    <div className={baseStyle}>
      <div className="">
        <h2 className="flex-1 text-xl text-base-content font-extrabold">
          {props.title}
        </h2>
        <p className="mt-2 text-xs">{props.description}</p>
      </div>
      <div className="flex justify-end items-center">{props.children}</div>
    </div>
  );
};

export default Header;
