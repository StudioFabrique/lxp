import Skill from "../../utils/interfaces/skill";
import Wrapper from "../UI/wrapper/wrapper.component";

interface EditModuleSkillsProps {
  skills: Skill[];
}

export default function EditModuleSkills({ skills }: EditModuleSkillsProps) {
  return (
    <Wrapper>
      <section className="w-full">
        <article className="flex flex-col gap-y-2">
          <h2 className="text-lg font-bold text-primary">Compétences</h2>
          <ul className="flex flex-col gap-y-2">
            {skills.map((item) => (
              <li key={item.id}>
                <Wrapper>
                  <p className="w-full font-bold">{item.description}</p>
                </Wrapper>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </Wrapper>
  );
}
