import Skill from "../../utils/interfaces/skill";
import Wrapper from "../UI/wrapper/wrapper.component";

interface EditModuleSkillsProps {
  skills: Skill[];
}

export default function EditModuleSkills({ skills }: EditModuleSkillsProps) {
  return (
    <section className="w-full grid grid-rows-3 gap-4">
      <Wrapper>
        <article className="flex flex-col gap-y-2">
          <h2 className="text-lg font-bold text-primary">Compétences</h2>
          <ul>
            {skills.map((item) => (
              <li key={item.id}>
                <Wrapper>
                  <p className="w-full font-bold">{item.description}</p>
                </Wrapper>
              </li>
            ))}
          </ul>
        </article>
      </Wrapper>
    </section>
  );
}
