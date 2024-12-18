import { ArrowLeft, ArrowRight } from "lucide-react";
import { cloneElement, ReactElement, useMemo } from "react";

// Props du composant de pagination
type Props = {
  page: number; // Numéro de la page courante
  perPage: number; // Nombre d'éléments par page
  setLimit: (limit: number) => void; // Fonction pour modifier le nombre d'éléments par page
  setPage: (page: number) => void; // Fonction pour changer de page
  totalPages: number; // Nombre total de pages
  children?: ReactElement;
};

/**
 * Composant de pagination permettant de naviguer entre les pages et de modifier le nombre d'éléments par page
 */
function Pagination({
  children,
  page,
  perPage,
  totalPages,
  setLimit,
  setPage,
}: Props) {
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
  const isButtonVisible = useMemo(() => {
    return `btn btn-sm btn-circle btn-primary ${
      totalPages > 1 ? "visible" : "invisible"
    }`;
  }, [totalPages]);

  // Contenu conditionnel : affiche les contrôles complets si plusieurs pages, sinon juste les infos
  const getContent = (
    <>
      {children
        ? cloneElement(children, { perPage, onChange: handleChange })
        : null}
      <>
        <button
          className={isButtonVisible}
          disabled={!canPrevious}
          onClick={() => setPage(page - 1)}
        >
          <ArrowLeft />
        </button>
        {pageInfos}
        <button
          className={isButtonVisible}
          disabled={!canNext}
          onClick={() => setPage(page + 1)}
        >
          <ArrowRight />
        </button>
      </>
    </>
  );

  return (
    <div className="flex justify-center items-center gap-x-4">{getContent}</div>
  );
}
export default Pagination;
