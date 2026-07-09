import { Edit } from "lucide-react";

type Props = {
  id: number;
  title: string;
  code: string;
  level: string;
  createdAt: string;
  parcours: number;
  onSelect: (id: number) => void;
};

const FormationCard = ({
  id,
  title,
  code,
  level,
  parcours,
  createdAt,
  onSelect,
}: Props) => (
  <div className="group flex flex-col gap-y-2 p-5 rounded-lg bg-secondary/20 h-full hover:bg-primary hover:text-white cursor-pointer">
    <span className="flex justify-between items-center">
      <h2 className="font-bold group-hover:text-white text-primary capitalize">
        {title}
      </h2>
      <Edit
        className="w-5 h-5 text-primary group-hover:text-white"
        onClick={() => onSelect(id)}
      />
    </span>
    <p>RNCP : {code}</p>
    <p>Niveau : {level}</p>
    <p>Parcours associés : {parcours}</p>
    <p>Créée le : {new Date(createdAt).toLocaleDateString("fr-FR")}</p>
  </div>
);

export default FormationCard;
