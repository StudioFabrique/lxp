import { Edit } from "lucide-react";
import { localeDate } from "../../helpers/locale-date";

interface FormationCardProp {
  id: number;
  title: string;
  code: string;
  level: string;
  createdAt: string;
  parcours: number;
  onSelect: (id: number) => void;
}

export default function FormationCard(props: FormationCardProp) {
  const { id, title, code, level, parcours, createdAt } = props;

  return (
    <div className="group flex flex-col gap-y-2 p-5 rounded-lg bg-secondary/20 h-full hover:bg-primary hover:text-white">
      <span className="flex justify-between items-center">
        <h2 className="font-bold group-hover:text-white text-primary">
          {title}
        </h2>
        <Edit
          className="w-5 h-5 text-primary group-hover:text-white cursor-pointer"
          onClick={() => props.onSelect(id)}
        />
      </span>
      <p>RNCP : {code}</p>
      <p>Niveau : {level}</p>
      <p>Parcours associés : {parcours}</p>

      <p>Créée le : {localeDate(createdAt)}</p>
    </div>
  );
}
