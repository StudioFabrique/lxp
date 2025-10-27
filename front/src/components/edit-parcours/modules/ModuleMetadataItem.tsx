import { Copy } from "lucide-react";
import { Metadatas } from "./useNewModule";

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
    <div className="grid grid-cols-[1fr_auto] gap-4 items-start">
      <div>
        <p className="font-semibold">
          Parcours : {metadata.parcours?.title ?? "Sans titre"}
        </p>
        <div className="text-xs text-base-content/70">
          {metadata.courses?.length ?? 0} cours sont associés au module :
          {metadata.courses?.map((course) => (
            <span
              key={course.id}
              className="badge badge-secondary mx-1 mb-1 font-normal text-xs"
            >
              {course.title}
            </span>
          ))}
          {metadata.courses?.length > 0 && <div className="divider" />}
        </div>
      </div>
      <Copy
        className="cursor-pointer w-6 h-6 text-primary hover:brightness-125 flex-shrink-0"
        onClick={onCopy}
      />
    </div>
  );
}
