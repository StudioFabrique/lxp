import Parcours from "../../utils/interfaces/parcours";
import ParcoursItem from "./parcours-item";
import { Loader2 } from "lucide-react";

interface TeacherLastParcoursProps {
  parcours: Parcours[];
  isLoading: boolean;
}

export default function TeacherLastParcours({
  parcours,
  isLoading,
}: TeacherLastParcoursProps) {
  const style =
    parcours && parcours?.length > 1
      ? "grid grid-cols-2 gap-2"
      : "grid grid-cols-1 gap-2";

  return (
    <>
      {isLoading && !parcours ? (
        <div className="w-full h-[12rem] flex justify-center items-center">
          <Loader2 className="animate-spin text-primary" />
        </div>
      ) : null}

      {parcours && parcours.length > 0 ? (
        <ul className={style}>
          {parcours.map((item) => (
            <li key={item.title}>
              <ParcoursItem parcours={item} />
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}
