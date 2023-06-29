import SkillsHeader from "./skills-header";
import SkillsList from "./skills-list";
import Wrapper from "../UI/wrapper/wrapper.component";

const Skills = () => {
  return (
    <div className="w-full">
      <Wrapper>
        <SkillsHeader />
        <SkillsList />
      </Wrapper>
    </div>
  );
};

export default Skills;
