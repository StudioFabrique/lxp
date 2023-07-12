import SkillsHeader from "./skills-header.component";
import SkillsList from "./skills-list.component";
import Wrapper from "../UI/wrapper/wrapper.component";
import RightSideDrawer from "../UI/right-side-drawer/right-side-drawer";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import ImportedSkills from "./imported-skills.component";

const Skills = () => {
  const importedSkills = useSelector(
    (state: any) => state.parcours.importedSkills
  );

  const handleCloseDrawer = (id: string) => {
    document.getElementById(id)?.click();
  };

  useEffect(() => {
    if (importedSkills.length > 0) {
      document.getElementById("import-skills")?.click();
    }
  }, [importedSkills]);

  return (
    <div className="w-full">
      <Wrapper>
        <SkillsHeader />
        <SkillsList />
        <RightSideDrawer
          title="Importer des Compétences"
          id="import-skills"
          visible={false}
        >
          {importedSkills.length > 0 ? (
            <ImportedSkills
              data={importedSkills}
              onCloseDrawer={handleCloseDrawer}
            />
          ) : null}
        </RightSideDrawer>
      </Wrapper>
    </div>
  );
};

export default Skills;
