import { MetadataList, Metadatas } from "../../../utils/interfaces/new-module";
import ModuleMetadataItem from "./ModuleMetadataItem";

type ModuleListItemProps = {
  module: MetadataList;
  currentParcoursId: number;
  onCopyModule: (module: MetadataList, metadatas: Metadatas) => void;
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

  // ✅ Vérifier si le module a des metadatas
  const hasMetadatas = module.metadatas && module.metadatas.length > 0;
  const hasOtherParcoursMetadatas =
    otherParcoursMetadatas && otherParcoursMetadatas.length > 0;

  // ✅ Afficher si : pas de metadatas du tout OU metadatas dans d'autres parcours
  const shouldDisplay = !hasMetadatas || hasOtherParcoursMetadatas;

  // Don't render if module only exists in current parcours
  if (!shouldDisplay) {
    return null;
  }

  const handleCopy = (meta: Metadatas) => {
    onCopyModule(module, meta);
  };

  // ✅ Affichage conditionnel selon le cas
  return (
    <div className="collapse bg-base-100 border border-base-300">
      <input type="radio" name="my-accordion-1" />
      <div className="collapse-title font-semibold flex flex-col gap-y-1">
        <span>{module.title}</span>
        {!hasMetadatas ? (
          <span className="font-bold text-xs text-base-content/60">
            Module non utilisé dans un parcours
          </span>
        ) : (
          <span className="font-bold text-xs text-base-content/60">
            Utilisé dans {otherParcoursMetadatas.length} autre(s) parcours.
          </span>
        )}
      </div>
      <div className="collapse-content text-sm">
        {!hasMetadatas ? (
          <div className="py-2">
            <p className="text-base-content/70 mb-3">
              Ce module n'est rattaché à aucun parcours.
            </p>
            <button
              onClick={() => handleCopy({} as Metadatas)} // Metadata vide pour module orphelin
              className="btn btn-sm btn-primary"
            >
              Utiliser ce module
            </button>
          </div>
        ) : (
          otherParcoursMetadatas.map((meta: Metadatas) => (
            <ModuleMetadataItem
              key={meta.id}
              metadata={meta}
              onCopy={() => handleCopy(meta)}
            />
          ))
        )}
      </div>
    </div>
  );
}
