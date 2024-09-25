import { Component } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";

type Props = {
  currentRoute: string[];
};

export default function Module({ currentRoute }: Props) {
  const isCurrentPathActive = useMemo(
    () => currentRoute[1] === "module",
    [currentRoute],
  );

  return (
    <li>
      <div className="flex items-center">
        <Link
          to={`/${currentRoute[0]}/module`}
          className="tooltip tooltip-top w-6 h-6 z-10"
          data-tip="Modules"
        >
          <div className="flex hover justify-center items-center">
            <Component />
            <span
              className={`absolute p-5 rounded-lg hover:bg-primary/50 ${
                isCurrentPathActive && "bg-primary/50"
              }`}
            />
          </div>
        </Link>
      </div>
    </li>
  );
}
