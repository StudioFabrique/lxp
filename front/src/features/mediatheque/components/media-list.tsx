import { Eye, File, Image, ListTree, Music, Video } from "lucide-react";
import { HierarchicalListRow } from "../../../components/UI/hierarchical-list-card/HierarchicalListRow";
import { displaySize } from "../../../utils/helpers/size-unit-conversion";
import type Media from "../interfaces/media";
import { getMediaUrl } from "./media-list.utils";

type MediaListProps = {
  medias: Media[];
  onPreview: (media: Media) => void;
  onShowActivities: (media: Media) => void;
};

const typeLabels = {
  image: "Image",
  video: "Vidéo",
  audio: "Audio",
  resource: "Fichier",
};

const mediaIcon = (type: Media["type"]) => {
  switch (type) {
    case "image":
      return <Image strokeWidth={1.5} />;
    case "video":
      return <Video strokeWidth={1.5} />;
    case "audio":
      return <Music strokeWidth={1.5} />;
    default:
      return <File strokeWidth={1.5} />;
  }
};

export default function MediaList({
  medias,
  onPreview,
  onShowActivities,
}: MediaListProps) {
  return (
    <ul className="list overflow-hidden rounded-box border border-base-300 bg-base-100 py-2">
      {medias.map((media, index) => (
        <HierarchicalListRow
          key={media.id}
          hideDivider={index === medias.length - 1}
          item={{
            id: media.id,
            title: media.name || media.url,
            description: typeLabels[media.type],
            subDescription: `${displaySize(media.size)}`,
            image:
              media.type === "image"
                ? { src: getMediaUrl(media), alt: "" }
                : undefined,
            icon: media.type === "image" ? undefined : mediaIcon(media.type),
            action: (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="btn btn-square btn-sm h-10 min-h-10 w-10 btn-ghost tooltip tooltip-left"
                  data-tip="Afficher un aperçu"
                  aria-label={`Afficher un aperçu de ${media.name}`}
                  onClick={() => onPreview(media)}
                >
                  <Eye className="size-[1.125rem]" />
                </button>
                <button
                  type="button"
                  className="btn btn-sm h-10 min-h-10 gap-1.5 px-3 btn-ghost tooltip tooltip-left"
                  data-tip="Voir les activités associées"
                  aria-label={`Voir les activités associées à ${media.name}`}
                  onClick={() => onShowActivities(media)}
                >
                  <ListTree className="size-[1.125rem]" />
                  <span aria-hidden="true">
                    {media.associatedActivities.length}
                  </span>
                </button>
              </div>
            ),
          }}
        />
      ))}
    </ul>
  );
}

export { MediaPreview } from "./media-preview";
