import React, { FC, ReactElement, ReactNode } from "react";

import Wrapper from "../UI/wrapper/wrapper.component";
import ParcoursSectionHeader from "./parcours-section-header.component";
import RightSideDrawer from "../UI/right-side-drawer/right-side-drawer";

type Props = {
  title: string;
  children: [ReactNode, ReactElement];
  section: string;
  onResetList: () => void;
};

const ParcoursSection: FC<Props> = ({
  title,
  children,
  section,
  onResetList,
}) => {
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
      <h3 className="text-3xl font-extrabold mb-4">{section}</h3>
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
