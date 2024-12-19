import ReactPlayer from "react-player";
import Media from "../../utils/interfaces/media";
import { ACTIVITIES_VIDEOS } from "../../config/urls";
import CardMedia from "./card-media";

// Définition du type des props du composant
type Props = {
  videos: Media[]; // Tableau d'objets Media
};

// Composant ListVideos qui affiche une liste de vidéos
function ListVideos({ videos }: Props) {
  return (
    // Container principal avec flex pour centrer le contenu
    <div className="flex-1 flex flex-col justify-around items-center gap-y-4">
      {/* Affiche la liste uniquement s'il y a des vidéos */}
      {videos && videos.length > 0 ? (
        <ul>
          {/* Mapping sur le tableau de vidéos pour créer les lecteurs */}
          {(videos as Media[]).map((item) => (
            <li key={item.id}>
              <CardMedia media={item}>
                <figure>
                  {/* Lecteur vidéo React avec contrôles */}
                  <ReactPlayer
                    url={ACTIVITIES_VIDEOS + item.url}
                    controls
                    width="100%"
                    height="auto"
                  />
                </figure>
              </CardMedia>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default ListVideos;
