import { useDispatch } from "react-redux";

import SkillsHeader from "./skills-header.component";
import SkillsList from "./skills-list.component";
import ImportSkills from "./import-skills.component";
import { parcoursSkillsAction } from "../../../store/redux-toolkit/parcours/parcours-skills";
import RightSideDrawer from "../../UI/right-side-drawer/right-side-drawer";
import Wrapper from "../../UI/wrapper/wrapper.component";

const Skills = () => {
  const dispatch = useDispatch();

  // gère la fermeture du drawer
  const handleCloseDrawer = (id: string) => {
    dispatch(parcoursSkillsAction.importSkills([]));
    document.getElementById(id)?.click();
  };

  // ouverture du drawer
  const handleOpenImportDrawer = () => {
    dispatch(parcoursSkillsAction.importSkills([]));
    document.getElementById("import-data")?.click();
  };

  return (
    <div className="w-full">
      <h3 className="text-xl font-bold mb-4">Compétences Complémentaires</h3>
      <Wrapper>
        <SkillsHeader onImport={handleOpenImportDrawer} />
        <SkillsList />
        <RightSideDrawer
          title="Importer des Compétences"
          id="import-data"
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
