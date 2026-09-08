import {
  ExternalLink,
  Eye,
  File,
  Image,
  ListTree,
  Music,
  Video,
} from "lucide-react";

import { HierarchicalListRow } from "../../../components/UI/hierarchical-list-card/HierarchicalListRow";
import { displaySize } from "../../../utils/helpers/size-unit-conversion";
import type Media from "../interfaces/media";

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
          dismissOverflow={() => {}}
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
                  className="btn btn-square btn-sm btn-ghost tooltip tooltip-left"
                  data-tip="Afficher un aperçu"
                  aria-label={`Afficher un aperçu de ${media.name}`}
                  onClick={() => onPreview(media)}
                >
                  <Eye className="size-[1.2em]" />
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-ghost gap-1 tooltip tooltip-left"
                  data-tip="Voir les activités associées"
                  aria-label={`Voir les activités associées à ${media.name}`}
                  onClick={() => onShowActivities(media)}
                >
                  <ListTree className="size-[1.2em]" />
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

function getMediaUrl(media: Media) {
  const base = import.meta.env.VITE_API_BASE_URL ?? "/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  const directories: Record<Media["type"], string> = {
    image: "activities/images/",
    video: "activities/videos/",
    audio: "activities/audios/",
    resource: "activities/files/",
  };

  return `${normalizedBase}${directories[media.type]}${encodeURIComponent(media.url)}`;
}

export function MediaPreview({ media }: { media: Media }) {
  const url = getMediaUrl(media);

  if (media.type === "image") {
    return (
      <img
        src={url}
        alt={media.name}
        className="h-full w-full object-contain"
      />
    );
  }

  if (media.type === "video") {
    return (
      <video className="h-full w-full object-contain" src={url} controls>
        Votre navigateur ne permet pas de lire cette vidéo.
      </video>
    );
  }

  if (media.type === "audio") {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <audio className="w-full max-w-2xl" src={url} controls>
          Votre navigateur ne permet pas de lire ce fichier audio.
        </audio>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <iframe
        src={url}
        title={`Aperçu de ${media.name}`}
        className="min-h-0 grow rounded-box border border-base-300 bg-white"
      />
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="btn btn-primary self-end"
      >
        <ExternalLink className="size-4" />
        Ouvrir dans un nouvel onglet
      </a>
    </div>
  );
}
