import { useEffect, useState } from "react";
import { ACTIVITIES } from "../../config/urls";
import { displaySize } from "../../utils/helpers/size-unit-conversion";
import usePaginatedMediatheque from "../../../src/hooks/use-paginated-mediatheque";
import Media from "../../utils/interfaces/media";
import Pagination from "../../../src/components/pagination";

type Props = {
  onClose: () => void;
};

/**
 * DialogImages - Composant modal pour afficher et sélectionner des images de la médiathèque
 * @param {Props} onClose - Fonction pour fermer le modal
 */
function DialogImages({ onClose }: Props) {
  // Hook personnalisé pour gérer la pagination des médias
  const { list, page, perPage, totalPages, setPage, setLimit } =
    usePaginatedMediatheque();
  // État pour gérer l'image sélectionnée
  const [selectedImage, setSelectedImage] = useState<Media | null>(null);
  // Canal de communication entre les onglets du navigateur
  const channel = new BroadcastChannel("clipboardChannel");

  // Styles de base pour les éléments de la liste
  const baseStyle = "flex flex-col items-center gap-y-1 p-1 rounded-md";

  /**
   * Détermine le style CSS en fonction de la sélection de l'image
   */
  const getStyle = (item: Media) => {
    if (selectedImage && item.id === selectedImage.id) {
      return baseStyle + " bg-primary text-white";
    }
    return baseStyle + " hover:bg-secondary hover:text-white";
  };

  /**
   * Copie l'URL de l'image sélectionnée dans le presse-papiers
   * et diffuse l'information aux autres onglets
   */
  const handleCopyUrl = async () => {
    const valueToCopy = selectedImage!.url;
    try {
      await navigator.clipboard.writeText(valueToCopy);
      channel.postMessage(valueToCopy);
    } catch (error) {
      console.error("Échec de la copie : ", error);
    }
  };

  // Définit la limite d'images par page au montage du composant
  useEffect(() => {
    setLimit(6);
  }, [setLimit]);

  return (
    <div className="modal modal-open" role="dialog">
      <div className="modal-box min-w-[55rem] min-h-[10rem] max-h-[35rem]">
        <div className="h-full flex flex-col gap-y-4">
          <h2 className="font-bold text-primary">Importer un fichier image</h2>
          {/* Affiche la grille d'images si la liste n'est pas vide */}
          {list.length > 0 ? (
            <>
              {/* Grille d'images */}
              <ul className="flex flex-wrap gap-x-8 gap-y-4 justify-start">
                {(list as Media[]).map((item) => (
                  <li className={getStyle(item)} key={item.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedImage(item)}
                    >
                      <div className="h-32 w-32 bg-black flex items-center justify-center">
                        <img
                          className="h-32 w-32 overflow-hidden object-contain"
                          src={ACTIVITIES + "/images/" + item.url}
                          alt={item.url}
                        />
                      </div>
                    </button>
                    <p className="text-xs hover:text-white mt-1">
                      {displaySize(item.size)}
                    </p>
                  </li>
                ))}
              </ul>
              {/* Barre de pagination et boutons d'action */}
              <div className="grid grid-cols-6 mt-4">
                <span className="col-span-4 flex justify-center">
                  <Pagination
                    page={page}
                    perPage={perPage}
                    totalPages={totalPages}
                    setPage={setPage}
                    setLimit={setLimit}
                  />
                </span>
                <div className="col-span-2 flex justify-end items-center gap-x-4">
                  <button
                    className="btn btn-primary btn-outline"
                    onClick={onClose}
                  >
                    Annuler
                  </button>
                  <button
                    className="btn btn-primary"
                    disabled={!selectedImage}
                    onClick={handleCopyUrl}
                  >
                    Importer
                  </button>
                </div>
              </div>
            </>
          ) : (
            // Message affiché si aucune image n'est disponible
            <>
              <span className="flex justify-center items-center h-full min-h-[10rem] w-full">
                <p>Aucune image n'a été trouvé dans la médiathèque.</p>
              </span>
              <span className="flex justify-center items-center">
                <button className="btn btn-primary" onClick={onClose}>
                  Fermer
                </button>
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DialogImages;
