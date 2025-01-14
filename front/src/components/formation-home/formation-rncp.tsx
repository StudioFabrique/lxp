import Wrapper from "../UI/wrapper/wrapper.component";

type Formation = {
  title: string;
  level: string;
  skillsSets: [{ rncpbc: string; name: string }];
  expires_at: string;
};

type Props = {
  formationRncp: Formation;
};

function FormationRncp({ formationRncp }: Props) {
  return (
    <div className="flex flex-col gap-y-4">
      <span className="flex flex-col gap-y-2">
        <h2 className="font-bold">Intitulé de la formation</h2>
        <Wrapper>
          <p>{formationRncp.title}</p>
        </Wrapper>
      </span>

      <span className="flex flex-col gap-y-2">
        <h2 className="font-bold">Niveau européen</h2>
        <Wrapper>
          <p>{formationRncp.level}</p>
        </Wrapper>
      </span>

      <span className="flex flex-col gap-y-2">
        <h2 className="font-bold">Blocs de compétences</h2>
        <ul className="flex flex-col gap-y-2">
          {formationRncp.skillsSets.map((item) => (
            <li key={item.rncpbc}>
              <Wrapper>{item.name}</Wrapper>
            </li>
          ))}
        </ul>
      </span>
    </div>
  );
}

export default FormationRncp;
