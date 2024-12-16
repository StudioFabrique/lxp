import { useEffect, useState } from "react";
import { ACTIVITIES } from "../../config/urls";
import { displaySize } from "../../helpers/sizeUnitConversion";
import usePaginatedMediatheque from "../../hooks/use-paginated-mediatheque";
import Media from "../../utils/interfaces/media";
import Pagination from "../pagination";

type Props = {
  onClose: () => void;
};

function DialogImages({ onClose }: Props) {
  const { list, page, perPage, totalPages, setPage, setLimit } =
    usePaginatedMediatheque();
  const [selectedImage, setSelectedImage] = useState<Media | null>(null);
  const channel = new BroadcastChannel("clipboardChannel");

  const baseStyle = "flex flex-col items-center gap-y-1 p-1 rounded-md";

  const getStyle = (item: Media) => {
    if (selectedImage && item.id === selectedImage.id) {
      return baseStyle + " bg-primary text-white";
    }
    return baseStyle + " hover:bg-secondary hover:text-white";
  };

  const handleCopyUrl = async () => {
    const valueToCopy = selectedImage!.url;
    try {
      await navigator.clipboard.writeText(valueToCopy);
      channel.postMessage(valueToCopy); // Envoie le message à tous les onglets
    } catch (error) {
      console.error("Échec de la copie : ", error);
    }
  };

  useEffect(() => {
    setLimit(6);
  }, [setLimit]);

  return (
    <div className="modal modal-open" role="dialog">
      <div className="modal-box w-[40rem] min-h-[10rem] max-h-[35rem]">
        <div className="h-full flex flex-col gap-y-4">
          <h2 className="font-bold">Importer un fichier image</h2>
          {list.length > 0 ? (
            <>
              <ul className="flex flex-wrap gap-x-8 gap-y-4 justify-center">
                {(list as Media[]).map((item) => (
                  <li className={getStyle(item)} key={item.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedImage(item)}
                    >
                      <img
                        className="h-24 w-auto"
                        src={ACTIVITIES + "/images/" + item.url}
                      />
                    </button>
                    <p className="text-xs hover:text-white">
                      {displaySize(item.size)}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="flex justify-center items-center gap-x-4 mt-4">
                <Pagination
                  page={page}
                  perPage={perPage}
                  totalPages={totalPages}
                  setPage={setPage}
                  setLimit={setLimit}
                />
              </div>
              <div className="flex justify-end items-center gap-x-4 mt-4">
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
            </>
          ) : (
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
