import { Copy } from "lucide-react";
import { Metadatas } from "../../../interfaces/new-module";

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
    <div className="flex items-start justify-between gap-3 rounded-lg border border-base-300 bg-base-100 p-3 hover:bg-base-200/60">
      <div className="min-w-0 flex-1">
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
      <button
        type="button"
        className="btn btn-primary btn-square btn-sm shrink-0"
        title="Associer ce module et son contenu au parcours actuel"
        aria-label="Associer ce module et son contenu au parcours actuel"
        onClick={onCopy}
      >
        <Copy className="h-4 w-4" />
      </button>
    </div>
  );
}
