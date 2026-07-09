// Import des types et composants nécessaires
import { CourseItem, Item } from "../../features/lesson/hooks/useAddLesson";
import Selecter from "../../components/UI/selecter/selecter.component";
import Wrapper from "../wrappers/BoxWrapper";

// Props du composant avec leurs types
type Props = {
  parcoursList: Item[]; // Liste des parcours disponibles
  modulesList: Item[]; // Liste des modules disponibles
  courseList: CourseItem[]; // Liste des cours disponibles
  parcoursId: number | null; // ID du parcours sélectionné
  moduleId: number | null; // ID du module sélectionné
  courseId: number | null; // ID du cours sélectionné
  handleStep: (value: boolean) => void; // Fonction pour gérer les étapes du formulaire
  getItem: (id: number | null, list: Item[]) => Item | undefined; // Fonction utilitaire pour trouver un élément dans une liste
  setParcoursId: (value: number | null) => void; // Fonction pour définir l'ID du parcours
  setModuleId: (value: number | null) => void; // Fonction pour définir l'ID du module
  setCourseId: (value: number | null) => void; // Fonction pour définir l'ID du cours
};

/**
 * Composant permettant de sélectionner un parcours, un module et un cours
 * Affiche trois sélecteurs en cascade
 */
export default function CourseSelecters(props: Props) {
  return (
    <Wrapper>
      {/* Container principal avec les sélecteurs */}
      <div className="h-full flex flex-col justify-start gap-y-4 mb-8">
        <div className="font-bold">
          Choisissez un parcours, un module et un cours
        </div>
        <div className="flex flex-col gap-y-8">
          {/* Sélecteur de parcours */}
          <span className="flex flex-col gap-y-2">
            <label htmlFor="parcours">Parcours</label>
            <Selecter
              list={props.parcoursList}
              title="Choisissez un parcours"
              defaultItem={props.getItem(props.parcoursId, props.parcoursList)}
              onSelectItem={props.setParcoursId}
            />
          </span>
          {/* Sélecteur de module */}
          <span className="flex flex-col gap-y-2">
            <label htmlFor="module">Module</label>
            <Selecter
              list={props.modulesList}
              title="Choisisez un module"
              defaultItem={props.getItem(props.moduleId, props.modulesList)}
              onSelectItem={props.setModuleId}
            />
          </span>
          {/* Sélecteur de cours */}
          <span className="flex flex-col gap-y-2">
            <label htmlFor="cours">Cours</label>
            <Selecter
              list={props.courseList}
              title="Choisisez un cours"
              defaultItem={props.getItem(props.courseId, props.courseList)}
              onSelectItem={props.setCourseId}
            />
          </span>
        </div>
      </div>

      {/* Bouton pour passer à l'étape suivante */}
      <div className="w-full flex items-end justify-end mt-12">
        <button
          className="btn btn-primary"
          onClick={() => props.handleStep(true)}
          disabled={!props.courseId} // Désactivé si aucun cours n'est sélectionné
        >
          Suivant
        </button>
      </div>
    </Wrapper>
  );
}
