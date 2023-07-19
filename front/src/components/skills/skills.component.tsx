import SkillsHeader from "./skills-header.component";
import SkillsList from "./skills-list.component";
import Wrapper from "../UI/wrapper/wrapper.component";
import RightSideDrawer from "../UI/right-side-drawer/right-side-drawer";
import ImportSkills from "./import-skills.component";

const Skills = () => {
  // gère la fermeture du drawer
  const handleCloseDrawer = (id: string) => {
    document.getElementById(id)?.click();
  };

  // ouverture du drawer
  const handleOpenImportDrawer = () => {
    document.getElementById("import-skills")?.click();
  };

  return (
    <div className="w-full">
      <Wrapper>
        <SkillsHeader onImport={handleOpenImportDrawer} />
        <SkillsList />
        <RightSideDrawer
          title="Importer des Compétences"
          id="import-skills"
          visible={false}
          onCloseDrawer={handleCloseDrawer}
        >
          <ImportSkills onCloseDrawer={handleCloseDrawer} />
        </RightSideDrawer>
      </Wrapper>
    </div>
  );
};

export default Skills;
