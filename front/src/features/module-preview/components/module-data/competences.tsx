import { CableCar } from "lucide-react";
import Skill from "../../../../../src/utils/interfaces/skill";
import Wrapper from "../../../../../src/components/wrappers/BoxWrapper";

type Props = {
  skills: Skill[];
};

const Competences = ({ skills }: Props) => {
  return (
    <Wrapper additionalClassname="w-full">
      <div className="flex flex-col gap-2 p-2">
        <div className="flex gap-2">
          <CableCar />
          <h3 className="text-xl font-bold">Compétences du module</h3>
        </div>
        <ul className="list-disc pl-5">
          {skills.map((skill) => (
            <li key={skill.id} className="first-letter:uppercase">
              {skill.description}
            </li>
          ))}
        </ul>
      </div>
    </Wrapper>
  );
};

export default Competences;
