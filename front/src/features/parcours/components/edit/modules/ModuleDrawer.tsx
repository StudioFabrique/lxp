import { useContext, useMemo, useState } from "react";
import RightSideDrawer from "../../../../../components/UI/right-side-drawer/right-side-drawer";
import ParcoursFilterBadges from "../../../../../components/UI/parcours-filter-badges";

import ModuleListItem from "./ModuleListItem";
import EmptyModulePlaceholder from "./EmptyModulePlaceholder";
import { SourceModule } from "../../../interfaces/new-module";
import { AuthContext } from "../../../../../store/AuthProvider";
import { getModulesLabel } from "../../../../../utils/helpers/user-role";

type ModuleDrawerProps = {
  sourceModules: SourceModule[] | null;
  currentParcoursId: number;
  onCopyModule: (module: SourceModule) => void;
};

/**
 * Right side drawer showing available modules from the formation
 * Allows users to duplicate existing modules
 */
export default function ModuleDrawer({
  sourceModules,
  currentParcoursId,
  onCopyModule,
}: ModuleDrawerProps) {
  const { user } = useContext(AuthContext);
  const [selectedParcours, setSelectedParcours] = useState<string | null>(null);
  const hasModules = sourceModules && sourceModules.length > 0;
  const parcours = useMemo(
    () => sourceModules?.map((module) => module.parcours.title) ?? [],
    [sourceModules],
  );
  const filteredModules = useMemo(
    () =>
      sourceModules?.filter(
        (module) =>
          selectedParcours === null ||
          module.parcours.title === selectedParcours,
      ) ?? [],
    [selectedParcours, sourceModules],
  );

  return (
    <RightSideDrawer
      title={getModulesLabel(user, "Modules associés à la formation")}
      id="duplicate_module_drawer"
      visible={false}
    >
      {hasModules ? (
        <>
          <div className="mb-4">
            <ParcoursFilterBadges
              parcours={parcours}
              selectedParcours={selectedParcours}
              onSelect={setSelectedParcours}
            />
          </div>
          {filteredModules.length > 0 ? (
            <ul className="flex flex-col gap-3 pr-1">
              {filteredModules.map((module) => (
                <ModuleListItem
                  key={module.id}
                  module={module}
                  currentParcoursId={currentParcoursId}
                  onCopyModule={onCopyModule}
                />
              ))}
            </ul>
          ) : (
            <p className="py-8 text-center text-base-content/70">
              Aucun module disponible pour ce parcours.
            </p>
          )}
        </>
      ) : (
        <EmptyModulePlaceholder />
      )}
    </RightSideDrawer>
  );
}
