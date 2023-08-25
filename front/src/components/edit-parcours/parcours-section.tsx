import React, { FC, ReactElement, ReactNode } from "react";

import Wrapper from "../UI/wrapper/wrapper.component";
import ParcoursSectionHeader from "./parcours-section-header.component";
import RightSideDrawer from "../UI/right-side-drawer/right-side-drawer";

type Props = {
  title: string;
  children: [ReactNode, ReactElement];
  onResetList: () => void;
};

const ParcoursSection: FC<Props> = ({ title, children, onResetList }) => {
  // gère la fermeture du drawer
  const handleCloseDrawer = (id: string) => {
    onResetList();
    document.getElementById(id)?.click();
  };

  // ouverture du drawer
  const handleOpenImportDrawer = () => {
    onResetList();
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
          {React.cloneElement(children[1], {
            onCloseDrawer: handleCloseDrawer,
          })}
        </RightSideDrawer>
      </Wrapper>
    </div>
  );
};

export default ParcoursSection;
