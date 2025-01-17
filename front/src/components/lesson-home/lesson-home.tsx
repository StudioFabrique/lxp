// Imports des dépendances externes
import { Link } from "react-router-dom";
import { localeDate, localeTime } from "../../helpers/locale-date";
import useEagerLoadingList from "../../hooks/use-eager-loading-list";
import Lesson from "../../utils/interfaces/lesson";
import Can from "../UI/can/can.component";
import DeleteIcon from "../UI/svg/delete-icon.component";
import EditIcon from "../UI/svg/edit-icon";
import LessonsList from "../edit-course/scenario/lessons-list";
import SortColumnIcon from "../UI/sort-column-icon.component/sort-column-icon.component";
import { Activity } from "lucide-react";

// Interface définissant les props du composant
interface LessonHomeProps {
  lessonsList: Lesson[]; // Liste des leçons à afficher
  onDelete: (id: number) => void; // Fonction de callback pour la suppression
}

// Composant principal pour l'affichage de la liste des leçons
export default function LessonHome({ lessonsList, onDelete }: LessonHomeProps) {
  // Utilisation du hook de chargement avec pagination et tri
  const {
    list,
    sortData,
    //page,
    //totalPages,
    fieldSort,
    direction,
    //getFilteredList,
    //resetFilters,
    //setPage,
  } = useEagerLoadingList(lessonsList, "title", 1000);

  //to={`/admin/lesson/edit/${item.id}`}

  // Contenu du tableau avec la liste des leçons
  const content = (
    <>
      {list && list.length > 0 ? (
        <>
          {list.map((item: Lesson) => (
            <tr
              className="text-xs lg:text-sm cursor-pointer hover:bg-secondary/20 hover:text-base-content"
              key={item.id}
            >
              {/* Colonne du titre */}
              <td className="bg-transparent rounded-l-lg truncate">
                {item.title}
              </td>
              {/* Colonne du cours */}
              <td className="bg-transparent capitalize truncate">
                {item.course ? item.course.title : "ND"}
              </td>
              {/* Colonne du parcours */}
              <td className="bg-transparent capitalize truncate">
                {item.course.module.parcours.title}
              </td>
              {/* Colonne de l'auteur */}
              <td className="bg-transparent capitalize truncate">
                {item.author}
              </td>
              {/* Colonne de la date de création */}
              <td className="bg-transparent truncate">
                {localeDate(item.createdAt ?? "")} à{" "}
                {localeTime(item.createdAt ?? "")}
              </td>
              {/* Colonne de la date de mise à jour */}
              <td className="bg-transparent truncate">
                {localeDate(item.updatedAt ?? "")}
              </td>
              {/* Bouton pour accéder aux activités */}
              <td className="bg-transparent">
                <div className="w-6 h-6">
                  <Can action="write" object="lesson">
                    <div
                      className="tooltip tooltip-bottom"
                      data-tip="Activités"
                    >
                      <Link
                        to={`/admin/lesson/edit/${item.id}`}
                        className="text-secondary"
                        aria-label="ajouter une activité"
                      >
                        <Activity />
                      </Link>
                    </div>
                  </Can>
                </div>
              </td>
              {/* Bouton d'édition */}
              <td className="bg-transparent">
                <div className="w-6 h-6">
                  <Can action="update" object="lesson">
                    <div
                      className="tooltip tooltip-bottom"
                      data-tip="Modifier la leçon"
                    >
                      <Link
                        to={`/admin/course/edit/${item.course.id}?step=4`}
                        className="text-secondary"
                        aria-label="Editer la leçon"
                      >
                        <EditIcon />
                      </Link>
                    </div>
                  </Can>
                </div>
              </td>
              {/* Bouton de suppression */}
              <td className="bg-transparent rounded-r-lg">
                <div
                  className="w-6 h-6 text-error"
                  aria-label="suppression de la leçon"
                >
                  <Can action="delete" object="lesson">
                    <div
                      className="tooltip tooltip-bottom flex-items-center"
                      data-tip="Supprimer la leçon"
                    >
                      <div onClick={() => onDelete(item.id!)}>
                        <DeleteIcon />
                      </div>
                    </div>
                  </Can>
                </div>
              </td>
            </tr>
          ))}
        </>
      ) : null}
    </>
  );

  // Rendu du composant
  return (
    <main className="w-5/6 flex flex-col items-center px-4 py-8 gap-8">
      <div className="w-full mt-16 min-h-[50%] flex justify-center items-center text-xs lg:text-sm">
        {lessonsList && LessonsList.length > 0 ? (
          <table className="table w-full border-separate border-spacing-y-2">
            {/* En-tête du tableau avec les colonnes triables */}
            <thead>
              <tr>
                <th
                  className="cursor-pointer"
                  onClick={() => {
                    sortData("title");
                  }}
                >
                  <div className="flex items-center gap-x-2">
                    <p>Titre</p>
                    <SortColumnIcon
                      fieldSort={fieldSort}
                      column="title"
                      direction={direction}
                    />
                  </div>
                </th>
                <th
                  className="cursor-pointer"
                  onClick={() => {
                    sortData("courses");
                  }}
                >
                  <div className="flex items-center gap-x-2">
                    <p>Cours</p>
                    <SortColumnIcon
                      fieldSort={fieldSort}
                      column="courses"
                      direction={direction}
                    />
                  </div>
                </th>
                <th
                  className="cursor-pointer"
                  onClick={() => {
                    sortData("parcours");
                  }}
                >
                  <div className="flex items-center gap-x-2">
                    <p>Parcours</p>
                    <SortColumnIcon
                      fieldSort={fieldSort}
                      column="parcours"
                      direction={direction}
                    />
                  </div>
                </th>
                <th
                  className="cursor-pointer"
                  onClick={() => {
                    sortData("author");
                  }}
                >
                  <div className="flex items-center gap-x-2">
                    <p>Auteur</p>
                    <SortColumnIcon
                      fieldSort={fieldSort}
                      column="author"
                      direction={direction}
                    />
                  </div>
                </th>
                <th
                  className="cursor-pointer"
                  onClick={() => {
                    sortData("createdAt");
                  }}
                >
                  <div className="flex items-center gap-x-2">
                    <p>Date de création</p>
                    <SortColumnIcon
                      fieldSort={fieldSort}
                      column="createdAt"
                      direction={direction}
                    />
                  </div>
                </th>
                <th
                  className="cursor-pointer"
                  onClick={() => {
                    sortData("updatedAt");
                  }}
                >
                  <div className="flex items-center gap-x-2">
                    <p>Dernière màj</p>
                    <SortColumnIcon
                      fieldSort={fieldSort}
                      column="updatedAt"
                      direction={direction}
                    />
                  </div>
                </th>
                <th></th>
              </tr>
            </thead>
            {/* Corps du tableau avec la liste des leçons */}
            <tbody>{content}</tbody>
          </table>
        ) : (
          <p>Aucune leçon trouvée</p>
        )}
      </div>
    </main>
  );
}
