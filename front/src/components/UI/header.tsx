/**
 * En tête pour les interfaces qui listent les groupes, les users, les parcours, etc...
 */

import { ReactNode } from "react";

interface HeaderProps {
  title: string;
  description?: string;
  classname?: string;
  children?: ReactNode;
}

const Header = (props: HeaderProps) => {
  return (
    <div className="w-full flex items-center justify-between p-4 rounded-lg bg-secondary/20">
      <div>
        <h2
          className={`flex-1 text-xl text-base-content font-extrabold capitalize ${props.classname}`}
        >
          {props.title}
        </h2>
        <p className="text-xs">{props.description}</p>
      </div>
      <div className="flex justify-end items-center">{props.children}</div>
    </div>
  );
};

export default Header;
