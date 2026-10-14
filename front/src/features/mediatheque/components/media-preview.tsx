import { ExternalLink } from "lucide-react";
import type Media from "../interfaces/media";
import { getMediaUrl } from "./media-list.utils";

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
