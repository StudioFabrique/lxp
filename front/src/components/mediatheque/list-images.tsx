import Media from "../../utils/interfaces/media";
import CardMedia from "./card-media";
import ImageCard from "./image-card";
import MediaFilterSelect from "./media-filter-select";

// Définition du type des props du composant
type Props = {
  images: Media[]; // Tableau d'objets Media
};

// Composant ListImages qui affiche une grille d'images
function ListImages({ images }: Props) {
  return (
    <>
      <MediaFilterSelect onChange={() => {}} />
      {/*Container principal avec flex pour centrer le contenu}*/}
      <div className="flex-1 flex flex-col justify-around items-center gap-y-4">
        {/* Affiche la grille uniquement s'il y a des images */}
        {images && images.length > 0 ? (
          // Grille responsive de 3 colonnes avec espacement
          <ul className="grid grid-cols-3 gap-8">
            {/* Mapping sur le tableau d'images pour créer les cartes */}
            {(images as Media[]).map((item) => (
              <li key={item.id}>
                <CardMedia media={item}>
                  <ImageCard media={item} />
                </CardMedia>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </>
  );
}

export default ListImages;
