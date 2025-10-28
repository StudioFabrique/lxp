import { MetadataList, Metadatas } from "../../../utils/interfaces/new-module";
import ModuleMetadataItem from "./ModuleMetadataItem";

type ModuleListItemProps = {
  module: MetadataList;
  currentParcoursId: number;
  onCopyModule: (module: MetadataList) => void;
};

/**
 * Collapsible module item in the drawer list
 * Shows module info and metadatas from other parcours
 */
export default function ModuleListItem({
  module,
  currentParcoursId,
  onCopyModule,
}: ModuleListItemProps) {
  // Filter metadatas to only show those from other parcours
  const otherParcoursMetadatas = module.metadatas?.filter(
    (meta: Metadatas) => meta.parcours?.id !== currentParcoursId
  );

  console.log({ module });

  // Don't render if module only exists in current parcours
  if (!otherParcoursMetadatas || otherParcoursMetadatas.length === 0) {
    return null;
  }

  return (
    <div className="collapse bg-base-100 border border-base-300">
      <input type="radio" name="my-accordion-1" />
      <div className="collapse-title font-semibold flex flex-col gap-y-1">
        <span>{module.title}</span>
        <span className="font-bold text-xs text-base-content/60">
          Utilisé dans {otherParcoursMetadatas.length} autre(s) parcours.
        </span>
      </div>
      <div className="collapse-content text-sm">
        {otherParcoursMetadatas.map((meta: Metadatas) => (
          <ModuleMetadataItem
            key={meta.id}
            metadata={meta}
            onCopy={() => onCopyModule(module)}
          />
        ))}
      </div>
    </div>
  );
}
