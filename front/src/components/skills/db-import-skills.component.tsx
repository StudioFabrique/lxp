import { FC } from "react";
import DBIcon from "../UI/svg-icons/db-icon.component";
import { getDBSkills } from "../../utils/fixtures/skills";

type Props = {
  origin: string;
  onFetchSkills: (data: Array<any>) => void;
};

const DbImportSkills: FC<Props> = ({ origin, onFetchSkills }) => {
  const handleFetchSkills = () => {
    // TODO: implémenter une requête HTTP pour récupérer les données
    onFetchSkills(getDBSkills());
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
