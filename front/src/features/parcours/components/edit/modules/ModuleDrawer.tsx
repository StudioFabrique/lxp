import RightSideDrawer from "../../../../../components/UI/right-side-drawer/right-side-drawer";

import ModuleListItem from "./ModuleListItem";
import EmptyModulePlaceholder from "./EmptyModulePlaceholder";
import { SourceModule } from "../../../interfaces/new-module";

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
  const hasModules = sourceModules && sourceModules.length > 0;

  return (
    <RightSideDrawer
      title="Modules associés à la formation"
      id="duplicate_module_drawer"
      visible={false}
    >
      {hasModules ? (
        <ul className="flex flex-col gap-3 pr-1">
          {sourceModules.map((module) => (
            <ModuleListItem
              key={module.id}
              module={module}
              currentParcoursId={currentParcoursId}
              onCopyModule={onCopyModule}
            />
          ))}
        </ul>
      ) : (
        <EmptyModulePlaceholder />
      )}
    </RightSideDrawer>
  );
}
