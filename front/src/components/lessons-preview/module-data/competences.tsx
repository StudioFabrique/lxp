import Skill from "../../../utils/interfaces/skill";
import Wrapper from "../../UI/wrapper/wrapper.component";

type Props = {
  skills: Skill[];
};

const Competences = ({ skills }: Props) => {
  return (
    <Wrapper>
      <div className="flex flex-col gap-2 p-2">
        <h3 className="text-xl font-bold">Competences du module</h3>
        <ul className="list-disc pl-5">
          {skills.map((skill) => (
            <li key={skill.id}>{skill.description}</li>
          ))}
        </ul>
      </div>
    </Wrapper>
  );
};

export default Competences;
