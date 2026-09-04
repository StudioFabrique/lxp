// Import des dépendances nécessaires
import { useContext } from "react";

import TablePagination from "../../../../../components/table/TablePagination";
import Group from "../../../../../../src/utils/interfaces/group";
import StudentGroupList from "./student-group-list";
import useEagerLoadingList from "../../../../../../src/hooks/useEagerLoadingList";
import { GroupList } from "./parcours-students.component";
import { AuthContext } from "../../../../../../src/store/AuthProvider";

// Interface définissant les props du composant
interface GroupsListProps {
  onCancel: (id: string) => void; // Fonction appelée pour annuler/fermer
  groups: GroupList[]; // Liste des groupes à afficher
  onAdd: (groups: Group[]) => void;
  createGroupHref: string;
}

/**
 * Composant principal pour afficher et gérer la liste des groupes
 * Permet de sélectionner des groupes et de les ajouter au parcours
 */
const GroupsList = (props: GroupsListProps) => {
  // Récupération du contexte pour les rôles utilisateur
  const { roles } = useContext(AuthContext);

  // Utilisation du hook personnalisé pour gérer la pagination, le tri et la sélection
  const {
    allChecked, // État de la sélection globale
    handleRowCheck, // Fonction pour gérer la sélection d'une ligne
    setAllChecked, // Fonction pour définir la sélection globale
    list, // Liste paginée des groupes
    limit, // Nombre d'éléments par page
    sortData, // Fonction pour trier les données
    page, // Page courante
    totalPages, // Nombre total de pages
    fieldSort, // Champ de tri actuel
    direction, // Direction du tri (asc/desc)
    setPage, // Fonction pour changer de page
    setLimit, // Fonction pour changer le nombre d'éléments par page
  } = useEagerLoadingList(
    props.groups,
    "formation",
    15,
    "_id",
    "parcours-groups",
  );

  /**
   * Gère la soumission des groupes sélectionnés
   * Filtre les groupes sélectionnés et les dispatch dans le store Redux
   */
  const handleSubmit = () => {
    const updatedGroups = list!.filter((item: Group) => item.isSelected);
    props.onAdd(updatedGroups);
    props.onCancel("add-group");
  };

  return (
    <article className="flex flex-col gap-y-4">
      {/* Affichage conditionnel de la liste des groupes */}
      {list ? (
        <StudentGroupList
          role={roles.find((item) => item.role === "student")!}
          allChecked={allChecked}
          groupList={list}
          onRowCheck={handleRowCheck}
          onAllChecked={setAllChecked}
          onSorting={sortData}
          fieldSort={fieldSort}
          direction={direction}
          createGroupHref={props.createGroupHref}
        />
      ) : null}
      {/* Affichage conditionnel de la pagination si plus d'une page */}
      {list && list.length > 0 && totalPages && totalPages > 1 ? (
        <TablePagination
          currentPage={page}
          maxPage={totalPages}
          itemsPerPage={limit}
          leftText={`Groupes : ${props.groups.length}`}
          onSetCurrentPage={setPage}
          onSetItemsPerPage={(itemsPerPage) => {
            setLimit(itemsPerPage);
            setPage(1);
          }}
          onSetPreviousPage={() =>
            setPage((current) => Math.max(current - 1, 1))
          }
          onSetNextPage={() =>
            setPage((current) => Math.min(current + 1, totalPages))
          }
        />
      ) : null}
      {/* Séparateur visuel */}
      <div className="divider" />
      {/* Boutons d'action pour annuler ou valider la sélection */}
      <div className="w-full flex justify-between">
        <button
          className="btn btn-primary btn-outline"
          onClick={() => props.onCancel("add-group")}
        >
          Annuler
        </button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Valider
        </button>
      </div>
    </article>
  );
};

export default GroupsList;
