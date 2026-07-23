import { MetadataList, Metadatas } from "../../../interfaces/new-module";
import ModuleMetadataItem from "./ModuleMetadataItem";

type ModuleListItemProps = {
  module: MetadataList;
  currentParcoursId: number;
  onCopyModule: (module: MetadataList, metadatas: Metadatas) => void;
};

/**
 * Collapsible module item in the drawer list.
 * Shows module info and all its metadatas, including the current parcours.
 */
export default function ModuleListItem({
  module,
  currentParcoursId,
  onCopyModule,
}: ModuleListItemProps) {
  const hasMetadatas = module.metadatas && module.metadatas.length > 0;

  const handleCopy = (meta: Metadatas) => {
    onCopyModule(module, meta);
  };

  // Conditional rendering based on module metadata state
  return (
    <li className="collapse collapse-arrow rounded-xl bg-base-100 border border-base-300 shadow-sm">
      <input
        type="radio"
        name="module-duplication-accordion"
        aria-label={`Afficher les occurrences du module ${module.title}`}
      />
      <div className="collapse-title min-h-0 py-3 pr-10 font-semibold flex flex-col gap-y-1">
        <span>{module.title}</span>
        {!hasMetadatas ? (
          <span className="font-bold text-xs text-base-content/60">
            Module non utilisé dans un parcours
          </span>
        ) : (
          <span className="font-bold text-xs text-base-content/60">
            Utilisé dans {module.metadatas.length} parcours.
          </span>
        )}
      </div>
      <div className="collapse-content space-y-2 text-sm">
        {!hasMetadatas ? (
          <div className="py-2">
            <p className="text-base-content/70 mb-3">
              Ce module n'est rattaché à aucun parcours.
            </p>
            <button
              onClick={() => handleCopy({} as Metadatas)} // Empty metadata for orphan module
              className="btn btn-sm btn-primary"
            >
              Utiliser ce module
            </button>
          </div>
        ) : (
          module.metadatas.map((meta: Metadatas) => (
            <ModuleMetadataItem
              key={meta.id}
              metadata={meta}
              isCurrentParcours={meta.parcours?.id === currentParcoursId}
              onCopy={() => handleCopy(meta)}
            />
          ))
        )}
      </div>
    </li>
  );
}
