import { Download, Trash2 } from "lucide-react";
import { displaySize } from "../../helpers/sizeUnitConversion";
import Media from "../../utils/interfaces/media";
import Wrapper from "../UI/wrapper/wrapper.component";
import { DOWNLOAD_URL } from "../../config/urls";
import MediaFilterSelect from "./media-filter-select";

// Props type definition for the component
type Props = {
  options: { value: string; label: string }[]; // Array of options for sorting
  resources: Media[]; // Array of Media objects
  onSort: (sort: "createdAt" | "size" | "used" | "name") => void; // Function to change the sorting criteria
};

/**
 * ListResources Component
 * Displays a list of media resources in a table-like format
 * @param {Media[]} resources - Array of media resources to display
 */
function ListResources({ options, resources, onSort }: Props) {
  /**
   * Opens the file in a new tab for preview/download
   * @param {Media} resource - The media resource to preview
   */
  const filePreview = (resource: Media) => {
    window.open(`${DOWNLOAD_URL}/activities/files/${resource.url}`, "_blank");
  };

  return (
    <>
      <div className="flex gap-x-4 items-center justify-end w-4/6">
        <h2>Trier par</h2>
        {/* Sélecteur pour changer le critère de tri */}
        <MediaFilterSelect onChange={onSort} options={options} />
      </div>

      {/*  Main container with responsive width */}
      <div className="2xl:w-3/4 w-full">
        {/* Table header */}
        <div className="text-xs font-bold w-full grid grid-cols-7 gap-4 mt-4 mb-2">
          <p className="col-span-4 ">Nom du fichier</p>
          <p>Taille</p>
          <p>Utilisé</p>
          <p>Actions</p>
        </div>

        {/* Resources list container */}
        <div className="w-full flex-1 flex flex-col justify-start items-center gap-y-4">
          {/* Conditional rendering of resources list */}
          {resources && resources.length > 0 ? (
            <ul className="w-full flex flex-col gap-y-2">
              {/* Map through resources to create list items */}
              {(resources as Media[]).map((item) => (
                <li key={item.id}>
                  <Wrapper>
                    <div className="w-full grid grid-cols-7 gap-4">
                      <p className="col-span-4">{item.name}</p>
                      <p className="text-center">{displaySize(item.size)}</p>
                      <p className="text-center">{item.used}</p>
                      <span className="flex justify-around items-center">
                        <button
                          className="tooltip tooltip-bottom"
                          data-tip="Télécharger ou afficher un aperçu du fichier"
                          onClick={() => filePreview(item)}
                        >
                          <Download className="text-primary" />
                        </button>
                        <button
                          className="text-error tooltip tooltip-bottom"
                          data-tip={`${
                            item.used > 0
                              ? "Impossible de supprimer ler fichier"
                              : "Supprimer le fichier"
                          }`}
                          disabled={item.used > 0}
                        >
                          <Trash2 />
                        </button>
                      </span>
                    </div>
                  </Wrapper>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default ListResources;
