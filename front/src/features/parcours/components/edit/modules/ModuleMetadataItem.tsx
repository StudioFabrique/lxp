import { Copy } from "lucide-react";
import { Metadatas } from "../../../../../../src/utils/interfaces/new-module";

type ModuleMetadataItemProps = {
  metadata: Metadatas;
  onCopy: () => void;
};

/**
 * Single metadata item display with parcours info and courses
 * Shows associated courses as badges
 */
export default function ModuleMetadataItem({
  metadata,
  onCopy,
}: ModuleMetadataItemProps) {
  return (
    <div className="flex items-center justify-between hover:brightness-125">
      <div>
        <p className="font-semibold">
          Parcours : {metadata.parcours?.title ?? "Sans titre"}
        </p>
        <div className="text-xs text-base-content/70 mb-2">
          {metadata.courses?.length ?? 0} cours sont associés au module :
          {metadata.courses?.map((course: { id: number; title: string }) => (
            <span
              key={course.id}
              className="badge badge-secondary mx-1 mb-1 font-normal text-xs"
            >
              {course.title}
            </span>
          ))}
        </div>
      </div>
      <div
        className="tooltip tooltip-left"
        data-tip="Associer ce module et son contenu au parcours actuel."
      >
        <Copy
          className="cursor-pointer w-6 h-6 text-primary hover:brightness-125 flex-shrink-0"
          aria-label="Copier les métadonnées"
          onClick={onCopy}
        />
      </div>
    </div>
  );
}
