import SkillsHeader from "./skills-header.component";
import SkillsList from "./skills-list.component";
import Wrapper from "../UI/wrapper/wrapper.component";
import { DrawerProvider } from "../../store/drawer.store";

const Skills = () => {
  return (
    <div className="w-full">
      <Wrapper>
        <SkillsHeader />
        <DrawerProvider>
          <SkillsList />
        </DrawerProvider>
      </Wrapper>
    </div>
  );
};

export default Skills;
