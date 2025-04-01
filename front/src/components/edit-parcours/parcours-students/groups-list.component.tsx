// Import des dépendances nécessaires
import { useContext } from "react";

import Pagination from "../../UI/pagination/pagination";
import Group from "../../../utils/interfaces/group";
import { useDispatch } from "react-redux";
import { parcoursGroupsAction } from "../../../store/redux-toolkit/parcours/parcours-groups";
import StudentGroupList from "./student-group-list";
import useEagerLoadingList from "../../../hooks/use-eager-loading-list";
import { GroupList } from "./parcours-students.component";
import { Context } from "../../../store/context.store";

// Interface définissant les props du composant
interface GroupsListProps {
  onCancel: (id: string) => void; // Fonction appelée pour annuler/fermer
  groups: GroupList[]; // Liste des groupes à afficher
}

/**
 * Composant principal pour afficher et gérer la liste des groupes
 * Permet de sélectionner des groupes et de les ajouter au parcours
 */
const GroupsList = (props: GroupsListProps) => {
  // Récupération du contexte pour les rôles utilisateur
  const { roles } = useContext(Context);
  // Initialisation du dispatch Redux pour les actions
  const dispatch = useDispatch();

  // Utilisation du hook personnalisé pour gérer la pagination, le tri et la sélection
  const {
    allChecked, // État de la sélection globale
    handleRowCheck, // Fonction pour gérer la sélection d'une ligne
    setAllChecked, // Fonction pour définir la sélection globale
    list, // Liste paginée des groupes
    sortData, // Fonction pour trier les données
    page, // Page courante
    totalPages, // Nombre total de pages
    fieldSort, // Champ de tri actuel
    direction, // Direction du tri (asc/desc)
    setPage, // Fonction pour changer de page
  } = useEagerLoadingList(props.groups, "formation", 15, "_id");

  /**
   * Gère la soumission des groupes sélectionnés
   * Filtre les groupes sélectionnés et les dispatch dans le store Redux
   */
  const handleSubmit = () => {
    const updatedGroups = list!.filter((item: Group) => item.isSelected);
    dispatch(parcoursGroupsAction.setGroups(updatedGroups));
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
        />
      ) : null}
      {/* Affichage conditionnel de la pagination si plus d'une page */}
      {totalPages && totalPages > 1 ? (
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
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
