// Imports des dépendances React et React Router
import { Link, useNavigate } from "react-router-dom";
import Can from "../UI/can/can.component";
import Header from "../UI/header";
import { PlusCircle, RefreshCw } from "lucide-react";
import Search from "../UI/search/search.component";
import { useCallback, useEffect, useState } from "react";

// Imports des hooks et utilitaires personnalisés
import useEagerLoadingList from "../../hooks/use-eager-loading-list";
import { searchListCourse } from "../../helpers/course/search-list-course";
import { courseSearchOptions } from "../../config/search-options";

// Imports des composants UI
import ToggleList from "../UI/toggle-list";
import CourseTable from "./course-table";
import Pagination from "../UI/pagination/pagination";
import CustomCourse from "./interfaces/custom-course";
import CourseCardsList from "./course-cards-list";
import useDeleteCourse from "../../hooks/use-delete-course";
import ModalDeleteCourse from "../UI/modal-delete-course";

// Interface définissant les props du composant
interface CourseListProps {
  coursesList: CustomCourse[];
  onRefreshCourses: () => void;
}

export default function CourseList(props: CourseListProps) {
  // Hook de navigation
  const nav = useNavigate();

  // État local pour gérer l'affichage en liste ou en cartes
  const [showList, setShowList] = useState(true);

  // Hook personnalisé pour gérer le chargement et le tri de la liste
  const {
    list,
    sortData,
    page,
    totalPages,
    fieldSort,
    direction,
    getFilteredList,
    resetFilters,
    setPage,
  } = useEagerLoadingList(props.coursesList, "title", 15);

  // Hook personnalisé pour gérer la suppression d'un cours
  const { showModal, handleShowModal, handleCloseModal, handleDeleteCourse } =
    useDeleteCourse<CustomCourse>(props.onRefreshCourses);

  /**
   * Gère la navigation vers la page d'édition d'un cours
   * @param id Identifiant du cours à éditer
   */
  const handleEditCourse = useCallback(
    (id: number) => {
      nav(`/admin/course/edit/${id}`);
    },
    [nav]
  );

  /**
   * Gère la recherche et le filtrage des cours
   * @param entityToSearch Propriété sur laquelle effectuer la recherche
   * @param searchValue Valeur recherchée
   */
  const handleSearchResult = (entityToSearch: string, searchValue: string) => {
    const filters = searchListCourse(entityToSearch, searchValue);
    getFilteredList(filters);
  };

  /**
   * Réinitialise les filtres de recherche
   */
  const handleResetSearch = () => {
    resetFilters();
  };

  // Affiche la modale de confirmation lors de la suppression d'un cours
  useEffect(() => {
    if (showModal) {
      (document.getElementById("my_modal_3") as HTMLFormElement).showModal();
    }
  }, [showModal]);

  return (
    <main className="w-full flex flex-col items-center py-8 gap-8">
      {/* En-tête avec titre et bouton d'ajout */}
      <section className="w-5/6 flex flex-col items-center">
        <Header
          title="Liste des cours"
          description="Liste des cours associés à un module."
        >
          <Can action="write" object="course">
            <Link className="btn btn-primary" to="add">
              <div className="flex gap-x-2 items-center">
                <PlusCircle className="w-8 h-8" />
                <p>Créer un cours</p>
              </div>
            </Link>
          </Can>
        </Header>
      </section>

      {/* Barre de recherche et bouton de réinitialisation */}
      <section className="w-5/6 flex justify-end">
        <article className="w-full flex justify-end items-center gap-x-2">
          <Search
            options={courseSearchOptions}
            placeholder="Filtrer"
            onSearch={handleSearchResult}
          />
          <div
            className="tooltip tooltip-left"
            data-tip="Réinitialise les options de recherche."
          >
            <RefreshCw
              className="text-primary cursor-pointer hover:animate-pulse"
              aria-label="réinitialise les options de recherche"
              onClick={handleResetSearch}
            />
          </div>
        </article>
      </section>

      {/* Section principale avec la liste des cours */}
      <section className="w-5/6 flex flex-col items-center">
        <article className="w-full flex justify-end items-center gap-x-4">
          <ToggleList showList={showList} onToggle={setShowList} />
        </article>
        {list ? (
          <>
            {showList ? (
              <CourseTable
                coursesList={list}
                onSorting={sortData}
                direction={direction}
                fieldSort={fieldSort}
                onEditCourse={handleEditCourse}
                onDeleteCourse={handleShowModal}
              />
            ) : (
              <CourseCardsList
                courseList={list}
                onDeleteCourse={handleShowModal}
              />
            )}
          </>
        ) : null}
      </section>

      {/* Pagination */}
      <section className="w-full">
        {totalPages > 1 ? (
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        ) : null}
      </section>

      {/* Modal de confirmation de suppression */}
      {showModal ? (
        <ModalDeleteCourse
          courseId={showModal.id}
          courseTitle={showModal.title}
          rightLabel="Confirmer"
          message="Le cours et les ressources qui lui sont associées seront définitivement supprimés."
          onConfirm={handleDeleteCourse}
          onCloseModal={handleCloseModal}
        />
      ) : null}
    </main>
  );
}
