import { ChangeEvent, Dispatch, FC, SetStateAction } from "react";

import PaginationSelect from "./pagination-select.component";

/**
 * Composant de pagination permettant de naviguer entre les pages et de définir le nombre d'éléments par page
 * @param page - Numéro de la page courante
 * @param totalPages - Nombre total de pages
 * @param setPage - Fonction pour changer de page
 * @param setPerPages - Fonction optionnelle pour définir le nombre d'éléments par page
 * @param perPage - Nombre d'éléments par page (optionnel)
 */
const Pagination: FC<{
  page: number;
  totalPages: number | null;
  setPage: Dispatch<SetStateAction<number>>;
  setPerPages?: Dispatch<SetStateAction<number>>;
  perPage?: number;
}> = ({ page, totalPages, setPage, setPerPages, perPage }) => {
  // Fonction pour aller à la page précédente
  const decrementPage = () => {
    setPage((prevPage) => prevPage - 1);
  };

  // Fonction pour aller à la page suivante
  const incrementPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  // Fonction pour aller à la première page
  const goToFistPage = () => {
    setPage(1);
  };

  // Fonction pour aller à la dernière page
  const goToLastPage = () => {
    setPage(totalPages!);
  };

  /**
   * Gère le changement du nombre d'éléments par page
   * Réinitialise à la première page et met à jour le nombre d'éléments
   */
  const handleSetPerPages = (event: ChangeEvent<HTMLSelectElement>) => {
    setPage(1);
    setPerPages!(parseInt(event.currentTarget.value) ?? 5);
  };

  return (
    <div className="flex justify-end mt-4 items-center gap-x-4 bg-transparent rounded-lg px-8 py-4 text-base-content text-sm border border-primary/20">
      {/* Sélecteur du nombre d'éléments par page */}
      <PaginationSelect
        handleSetPerPages={handleSetPerPages}
        perPage={perPage}
      />
      {/* Affichage de la page courante et du total */}
      <p>
        Page {page} sur {totalPages}
      </p>
      {/* Boutons de navigation (affichés uniquement s'il y a plus d'une page) */}
      {totalPages && totalPages > 1 ? (
        <div className="btn-group flex gap-x-4">
          <button
            className="btn btn-primary btn-sm"
            onClick={goToFistPage}
            disabled={page === 1}
            aria-label="afficher la première page"
          >
            {"<<"}
          </button>
          <button
            className="btn-primary btn btn-sm"
            disabled={page === 1}
            onClick={decrementPage}
            aria-label="afficher la page précédente"
          >
            {"<"}
          </button>
          <button
            className="btn-primary btn btn-sm"
            disabled={page === totalPages}
            onClick={incrementPage}
            aria-label="afficher la page suivante"
          >
            {">"}
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={goToLastPage}
            disabled={page === totalPages}
            aria-label="afficher la dernière page"
          >
            {">>"}
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Pagination;
