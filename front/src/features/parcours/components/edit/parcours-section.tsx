import React, { FC, ReactElement, ReactNode } from "react";

import ParcoursSectionHeader from "./parcours-section-header";
import RightSideDrawer from "../../../../components/UI/right-side-drawer/right-side-drawer";
import BoxWrapper from "../../../../components/wrappers/BoxWrapper";

type Props = {
  title: string;
  children: [
    ReactElement<{ header?: ReactNode }>,
    ReactElement<{ onCloseDrawer?: (id: string) => void }>,
  ];
  onResetList: () => void;
  readOnly?: boolean;
  /** Clé de validation du bloc : « Corriger » (voir `goToValidationTarget`) y amène la page. */
  fieldKey?: string;
};

const ParcoursSection: FC<Props> = ({
  title,
  children,
  onResetList,
  readOnly = false,
  fieldKey,
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
      <BoxWrapper id={fieldKey ? `parcours-field-${fieldKey}` : undefined}>
        {/* L'en-tête d'import est rendu par la liste, sur la même ligne que son bouton d'ajout. */}
        {React.cloneElement(children[0], {
          header: (
            <ParcoursSectionHeader
              label={title}
              onImport={handleOpenImportDrawer}
              disabled={readOnly}
            />
          ),
        })}
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
