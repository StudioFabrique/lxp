import { FileIcon, ImageIcon, MusicIcon, VideoIcon } from "lucide-react";
import ListImages from "./list-images";
import Media from "../../utils/interfaces/media";
import { ReactNode } from "react";

// Props du composant TabsMedia
type Props = {
  list: Media[]; // Liste des médias à afficher
  type: string; // Type de média sélectionné
  setType: (type: "image" | "video" | "audio" | "document") => void; // Fonction pour changer le type de media
  children: ReactNode; // Composants enfants (pagination)
};

function TabsMedia({ children, list, type, setType }: Props) {
  // Message affiché quand aucun fichier n'est trouvé
  const empty = <p>Aucun fichier de ce type n'a été trouvé.</p>;

  // Configuration des différents types de médias avec leurs propriétés
  const medias = [
    {
      type: "image",
      label: "Images",
      icon: <ImageIcon />,
      component: <ListImages images={list} />,
    },
    {
      type: "video",
      label: "Vidéos",
      icon: <VideoIcon />,
      component: empty,
    },
    {
      type: "audio",
      label: "Audios",
      icon: <MusicIcon />,
      component: empty,
    },
    {
      type: "document",
      label: "Documents",
      icon: <FileIcon />,
      component: empty,
    },
  ];

  return (
    <>
      {/* Barre d'onglets pour sélectionner le type de média */}
      <div role="tablist" className="tabs tabs-bordered mb-2">
        {medias.map((media) => (
          <a
            key={media.label}
            role="tab"
            className={`tab ${type === media.type ? "tab-active" : ""}`}
            onClick={() =>
              setType(media.type as "image" | "video" | "audio" | "document")
            }
          >
            {/* Contenu de l'onglet avec icône et label */}
            <span className="flex items-center gap-4 pb-2">
              <div className="w-4 h-4 flex items-center">{media.icon}</div>
              <span className="text-sm">{media.label}</span>
            </span>
          </a>
        ))}
      </div>
      {/* Affichage conditionnel du contenu en fonction de la présence de médias */}
      {list && list.length > 0 ? (
        <>{medias.find((media) => media.type === type)?.component}</>
      ) : (
        empty
      )}

      {/* Affichage de la pagination uniquement s'il y a des médias */}
      {list.length > 0 ? <>{children}</> : null}
    </>
  );
}

export default TabsMedia;
