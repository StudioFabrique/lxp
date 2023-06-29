import SkillsHeader from "./skills-header.component";
import SkillsList from "./skills-list.component";
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
