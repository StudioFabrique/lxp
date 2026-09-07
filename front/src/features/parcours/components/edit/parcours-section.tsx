import React, { FC, ReactElement, ReactNode } from "react";

import ParcoursSectionHeader from "./parcours-section-header";
import RightSideDrawer from "../../../../components/UI/right-side-drawer/right-side-drawer";
import BoxWrapper from "../../../../components/wrappers/BoxWrapper";

type Props = {
  title: string;
  children: [ReactNode, ReactElement<{ onCloseDrawer: (id: string) => void }>];
  section: string;
  onResetList: () => void;
  readOnly?: boolean;
};

const ParcoursSection: FC<Props> = ({
  title,
  children,
  section,
  onResetList,
  readOnly = false,
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
      <BoxWrapper>
        <ParcoursSectionHeader
          label={title}
          onImport={handleOpenImportDrawer}
          disabled={readOnly}
        />
        {children[0]}
        {!readOnly ? (
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
        ) : null}
      </BoxWrapper>
    </div>
  );
};

export default ParcoursSection;
