import { useDispatch } from "react-redux";

import Wrapper from "../../UI/wrapper/wrapper.component";
import ParcoursSectionHeader from "../parcours-section-header.component";
import { parcoursSkillsAction } from "../../../store/redux-toolkit/parcours/parcours-skills";
import RightSideDrawer from "../../UI/right-side-drawer/right-side-drawer";
import { ReactNode } from "react";

const ObjectivesSection = ({ children }: { children: ReactNode[] }) => {
  const dispatch = useDispatch();
  const title = "Importer une liste d'objectifs";

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
      <h3 className="text-xl font-bold mb-4">Objectifs</h3>
      <Wrapper>
        <ParcoursSectionHeader
          label={title}
          onImport={handleOpenImportDrawer}
        />
        {children[0]}
        <RightSideDrawer
          title={title}
          id="import-data"
          visible={false}
          onCloseDrawer={handleCloseDrawer}
        >
          {children[1]}
        </RightSideDrawer>
      </Wrapper>
    </div>
  );
};

export default ObjectivesSection;
