import type FormationItem from "../interfaces/formation-item";
import FormationCard from "./FormationCard";

type Props = {
  formationsList: FormationItem[];
  onSelect: (id: number) => void;
};

const FormationsList = ({ formationsList, onSelect }: Props) => (
  <div className="p-5 flex flex-col gap-y-4">
    <h2 className="font-bold">Formations enregistrées</h2>
    {formationsList.length > 0 && (
      <ul className="flex flex-col gap-y-4">
        {formationsList.map((item) => (
          <li key={item.id}>
            <FormationCard
              id={item.id}
              title={item.title}
              code={item.code}
              level={item.level}
              parcours={item.parcours}
              createdAt={item.createdAt}
              onSelect={onSelect}
            />
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default FormationsList;
