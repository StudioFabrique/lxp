import { Link, useNavigate } from "react-router-dom";
import Can from "../UI/can/can.component";
import Header from "../UI/header";
import { PlusCircle, RefreshCw } from "lucide-react";
import Search from "../UI/search/search.component";
import { useCallback, useEffect, useState } from "react";
import useEagerLoadingList from "../../hooks/use-eager-loading-list";
import { searchListCourse } from "../../helpers/course/search-list-course";
import { courseSearchOptions } from "../../config/search-options";
import ToggleList from "../UI/toggle-list";
import CourseTable from "./course-table";
import Pagination from "../UI/pagination/pagination";
import CustomCourse from "./interfaces/custom-course";
import CourseCardsList from "./course-cards-list";
import useDeleteCourse from "../../hooks/use-delete-course";
import ModalDeleteCourse from "../UI/modal-delete-course";

interface CourseListProps {
  coursesList: CustomCourse[];
  onRefreshCourses: () => void;
}

export default function CourseList(props: CourseListProps) {
  const nav = useNavigate();
  const [showList, setShowList] = useState(true);
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
  const { showModal, handleShowModal, handleCloseModal, handleDeleteCourse } =
    useDeleteCourse<CustomCourse>(props.onRefreshCourses);

  /**
   * navigue jusU'à la vue d'édition du cours identifié par son id
   * @param id number
   */
  const handleEditCourse = useCallback(
    (id: number) => {
      nav(`/admin/course/edit/${id}`);
    },
    [nav],
  );

  /**
   * permet de filtrer les objets affichés dans la liste, gère les propriétés nichées dans d'autres
   * @param entityToSearch string
   * @param searchValue string
   */
  const handleSearchResult = (entityToSearch: string, searchValue: string) => {
    const filters = searchListCourse(entityToSearch, searchValue);
    getFilteredList(filters);
  };

  const handleResetSearch = () => {
    resetFilters();
  };

  // affiche la modal de confirmation de suppression du cours
  useEffect(() => {
    if (showModal) {
      (document.getElementById("my_modal_3") as HTMLFormElement).showModal();
    }
  }, [showModal]);

  return (
    <main className="w-5/6 flex flex-col items-center px-4 py-8 gap-8">
      <section className="w-full">
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
      <section className="w-full flex">
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
      <section className="w-full flex flex-col">
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
      <section className="w-full">
        {totalPages > 1 ? (
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        ) : null}
      </section>
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
