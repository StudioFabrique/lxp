import { FC } from "react";
import DBIcon from "../UI/svg/db-icon.component";
import Skill from "../../utils/interfaces/skill";
import useHttp from "../../hooks/use-http";

type Props = {
  origin: string;
  onFetchSkills: (data: Array<any>) => void;
};

const DbImportSkills: FC<Props> = ({ origin, onFetchSkills }) => {
  const handleFetchSkills = () => {
    onFetchSkills([]);
  };

  return (
    <div
      className={`group w-[13rem] h-[8rem] flex flex-col text-xs gap-y-4 p-4 justify-center items-center font-bold rounded-xl shadow-xl border-2 hover:bg-primary border-primary/50 ${
        origin === "db" ? "bg-primary" : ""
      }`}
      onClick={handleFetchSkills}
    >
      <div
        className={`flex flex-col justify-center items-center gap-y-4 group-hover:text-white ${
          origin === "db" ? "text-white" : ""
        }`}
      >
        <DBIcon size={10} />
        <p>Base de données</p>
      </div>
    </div>
  );
};

export default DbImportSkills;