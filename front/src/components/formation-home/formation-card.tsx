import { Edit } from "lucide-react";

interface FormationCardProp {
  id: number;
  title: string;
  code: string;
  level: string;
  parcours: number;
  onSelect: (id: number) => void;
}

export default function FormationCard(props: FormationCardProp) {
  const { id, title, code, level, parcours } = props;

  return (
    <div className="group flex flex-col gap-y-2 p-5 rounded-lg bg-secondary/20 h-full hover:bg-primary hover:text-white">
      <h2 className="font-bold group-hover:text-white text-secondary">
        {title}
      </h2>
      <p>RNCP : {code}</p>
      <p>Niveau : {level}</p>
      <span className="flex justify-between items-center">
        <p>Parcours associés : {parcours}</p>
        <Edit
          className="w-5 h-5 text-primary group-hover:text-white cursor-pointer"
          onClick={() => props.onSelect(id)}
        />
      </span>
    </div>
  );
}
