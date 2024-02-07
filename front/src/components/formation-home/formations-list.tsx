import FormationCard from "./formation-card";

type FormationItem = {
  id: number;
  title: string;
  code: string;
  level: string;
  parcours: number;
};

interface FormationsListProps {
  formationsList: FormationItem[];
}

export default function FormationsList({
  formationsList,
}: FormationsListProps) {
  return (
    <div className="p-5 flex flex-col gap-y-4">
      <h2 className="font-bold">Formations enregistrées</h2>
      {formationsList && formationsList.length > 0 ? (
        <ul className="flex flex-col gap-y-4">
          {formationsList.map((item) => (
            <li key={item.id}>
              <FormationCard
                id={item.id}
                title={item.title}
                code={item.code}
                level={item.level}
                parcours={item.parcours}
                onSelect={() => {}}
              />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
