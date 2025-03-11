/* eslint-disable @typescript-eslint/no-explicit-any */

// Imports nécessaires
import Objective from "../../../utils/interfaces/objective";
import { sortArray } from "../../../utils/sortArray";
import InheritedItems from "../../inherited-items/inherited-items";
import InheritedTextList from "../../inherited-items/inherited-text-list";
import NotSelectedObjectives from "../../inherited-items/not-selected-objectives";

// Interface définissant les props du composant
interface ObjectivesWithDrawerProps {
  loading: boolean; // État de chargement
  initialList: Objective[]; // Liste initiale des objectifs disponibles
  currentItems: Objective[]; // Objectifs actuellement sélectionnés
  property: string; // Propriété à afficher (ex: "description")
  isDisabled: boolean; // Si le composant est désactivé
  onSubmit: (items: any[]) => void; // Callback appelé lors de la validation
  onSubmitNewObjective: (value: string) => void; // Callback pour créer un nouvel objectif
  loadingNewObjective: boolean; // État de chargement pour la création d'objectif
}

/**
 * Composant qui affiche un tiroir permettant de gérer les objectifs d'apprentissage
 * Permet de sélectionner des objectifs existants et d'en créer de nouveaux
 */
const ObjectivesWithDrawer = (props: ObjectivesWithDrawerProps) => {
  return (
    <InheritedItems
      tooltip="Associer un des objectifs du parcours à votre cours"
      buttonLabel="Sélectionner des objectifs"
      drawerId="add-objectives"
      drawerTitle="Sélectionner des objectifs"
      loading={props.loading}
      initialList={sortArray(props.initialList, "createdAt", false)} // Tri par date de création
      selectedItems={props.currentItems}
      isDisabled={props.isDisabled}
      property={props.property}
      onSubmit={props.onSubmit}
    >
      {/* Liste des objectifs déjà sélectionnés */}
      <InheritedTextList property="description" />

      {/* Composant pour ajouter de nouveaux objectifs */}
      <NotSelectedObjectives
        loading={props.loadingNewObjective}
        onSubmitNewObjective={props.onSubmitNewObjective}
      />
    </InheritedItems>
  );
};

export default ObjectivesWithDrawer;
