/**
 * En tête pour les interfaces qui listent les groupes, les users, les parcours, etc...
 */

import { ReactNode } from "react";

interface HeaderProps {
  title: string;
  description: string;
  children?: ReactNode;
}

const Header = (props: HeaderProps) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-y-8">
      <div className="w-full flex flex-col items-start">
        <h2 className="text-4xl text-base-content font-bold">{props.title}</h2>
        <p className="mt-2">{props.description}</p>
      </div>
    </div>
  );
};

export default Header;
