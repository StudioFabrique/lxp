import { useMemo } from "react";

// Props du composant de pagination
type Props = {
  page: number; // Numéro de la page courante
  perPage: number; // Nombre d'éléments par page
  setLimit: (limit: number) => void; // Fonction pour modifier le nombre d'éléments par page
  setPage: (page: number) => void; // Fonction pour changer de page
  totalPages: number; // Nombre total de pages
};

/**
 * Composant de pagination permettant de naviguer entre les pages et de modifier le nombre d'éléments par page
 */
function Pagination({ page, perPage, totalPages, setLimit, setPage }: Props) {
  // Gère le changement du nombre d'éléments par page
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(event.target.value));
  };

  // Vérifie si on peut aller à la page précédente
  const canPrevious = useMemo(() => {
    return page > 1;
  }, [page]);

  // Vérifie si on peut aller à la page suivante
  const canNext = useMemo(() => {
    return page < totalPages;
  }, [page, totalPages]);

  // Affichage des informations de pagination (numéro de page courant / total)
  const pageInfos = (
    <p>
      Page {page} de {totalPages}
    </p>
  );

  // Contenu conditionnel : affiche les contrôles complets si plusieurs pages, sinon juste les infos
  const getContent =
    totalPages > 1 ? (
      <>
        <p>Nombre d'éléments par page</p>
        <select
          className="select select-bordered select-sm focus:outline-none"
          onChange={handleChange}
          value={perPage}
        >
          <option>10</option>
          <option>20</option>
          <option>30</option>
        </select>
        <button
          className="btn btn-sm btn-circle btn-primary"
          disabled={!canPrevious}
          onClick={() => setPage(page - 1)}
        >
          {"<"}
        </button>
        {pageInfos}
        <button
          className="btn btn-sm  btn-circle btn-primary"
          disabled={!canNext}
          onClick={() => setPage(page + 1)}
        >
          {">"}
        </button>
      </>
    ) : (
      <>{pageInfos}</>
    );

  return (
    <div className="flex justify-center items-center gap-x-4">{getContent}</div>
  );
}
export default Pagination;
