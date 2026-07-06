import ReactPlayer from "react-player";
import Media from "../../utils/interfaces/media";
import { ACTIVITIES_VIDEOS } from "../../config/urls";
import CardMedia from "./card-media";
import MediaFilterSelect from "./media-filter-select";

// Définition du type des props du composant
type Props = {
  options: { value: string; label: string }[];
  videos: Media[]; // Tableau d'objets Media
  onSort: (sort: "createdAt" | "size" | "used") => void; // Fonction pour changer le critère de tri
};

// Composant ListVideos qui affiche une liste de vidéos
function ListVideos({ options, videos, onSort }: Props) {
  return (
    <>
      <div className="flex gap-x-4 items-center justify-end w-4/6">
        <h2>Trier par</h2>
        {/* Sélecteur pour changer le critère de tri */}
        <MediaFilterSelect onChange={onSort} options={options} />
      </div>
      {/* Container principal avec flex pour centrer le contenu} */}
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
    </>
  );
}

export default ListVideos;
