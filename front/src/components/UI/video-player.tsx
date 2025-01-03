// Import des dépendances nécessaires
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { ACTIVITIES_VIDEOS } from "../../config/urls";
import Wrapper from "./wrapper/wrapper.component";

// Interface définissant les props du composant VideoPlayer
interface VideoPlayerProps {
  source: string; // URL source de la vidéo
  title?: string; // Titre optionnel de la vidéo
  description?: string; // Description optionnelle de la vidéo
}

/**
 * Composant VideoPlayer
 * Affiche une vidéo avec son titre et sa description optionnels
 */
export default function VideoPlayer({
  source,
  title,
  description,
}: VideoPlayerProps) {
  // État pour stocker l'URL finale de la vidéo
  const [videoUrl, setVideoUrl] = useState("");

  // Effet pour construire l'URL de la vidéo
  useEffect(() => {
    if (source !== undefined) {
      // Si la source commence par http, c'est une URL externe (ex: YouTube)
      if (source.startsWith("http")) {
        setVideoUrl(source);
      } else {
        // Sinon, c'est une vidéo hébergée localement
        setVideoUrl(ACTIVITIES_VIDEOS + source);
      }
    }
  }, [source]);

  return (
    <div className="w-full flex flex-col items gap-y-2">
      <Wrapper>
        {/* Affichage du titre et de la description si fournis */}
        {title !== undefined ? (
          <>
            <p className="text-xs">Titre</p>
            <Wrapper>
              <h2>{title}</h2>
            </Wrapper>
            <p className="text-xs">Description</p>
            <Wrapper>
              <h2>{description}</h2>
            </Wrapper>
          </>
        ) : null}
        {/* Lecteur vidéo centré */}
        <div className="flex justify-center">
          <ReactPlayer url={videoUrl} controls />
        </div>
      </Wrapper>
    </div>
  );
}
