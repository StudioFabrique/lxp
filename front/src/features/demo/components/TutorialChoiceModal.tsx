import { useContext } from "react";
import { Compass, PlayCircle, X } from "lucide-react";
import { AuthContext } from "../../../store/AuthProvider";
import { hasRoleRank } from "../../../utils/helpers/user-role";
import { Link } from "react-router";

type Props = {
  demoUrl: string;
  onClose: () => void;
  onStartTutorial: () => void;
};

/**
 * Choix proposé avant de lancer un tutoriel, sur une instance ordinaire.
 *
 * Le tutoriel guidé fait réellement créer du contenu, ce qui ne convient pas à
 * tout le monde ; la démonstration donne un aperçu complet sans rien produire.
 * Le libellé du premier choix suit donc le rôle : créer du contenu pour une
 * équipe pédagogique, découvrir l'interface pour un apprenant.
 */
const TutorialChoiceModal = ({ demoUrl, onClose, onStartTutorial }: Props) => {
  const { user } = useContext(AuthContext);
  const isStaff = hasRoleRank(user, [0, 1, 2]);

  const tutorialLabel = isStaff ? "Tutoriel guidé" : "Tutoriel de découverte";

  const tutorialDescription = isStaff
    ? "Un pas à pas dans votre espace, de la formation jusqu'à la première activité."
    : "Un tour de votre espace d'apprentissage et des outils qui vous accompagnent.";

  return (
    <div
      className="fixed inset-0 z-3000 flex items-center justify-center bg-slate-950/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutorial-choice-title"
    >
      <div className="w-full max-w-xl rounded-2xl border border-base-300 bg-base-100 p-6 text-base-content shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="tutorial-choice-title" className="text-lg font-bold">
              Par où commencer ?
            </h2>
            <p className="mt-1 text-sm text-base-content/70">
              Deux façons de découvrir ANDRIA.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-xs btn-circle"
            onClick={onClose}
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            className="card cursor-pointer border border-base-300 p-4 text-left transition hover:border-primary hover:shadow-md"
            onClick={onStartTutorial}
          >
            <div className="flex gap-2">
              <PlayCircle className="h-6 w-6 text-primary" />
              <h3 className="font-bold">{tutorialLabel}</h3>
            </div>
            <p className="mt-1 text-sm text-base-content/70">
              {tutorialDescription}
            </p>
          </button>

          <Link
            to={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="card cursor-pointer border border-base-300 p-4 text-left transition hover:border-primary hover:shadow-md"
            onClick={onClose}
          >
            <div className="flex gap-2">
              <Compass className="h-6 w-6 text-primary" />
              <h3 className="font-bold">Mode démonstration</h3>
            </div>
            <p className="mt-1 text-sm text-base-content/70">
              Un espace de démonstration rempli de contenus, en consultation
              seule. S'ouvre dans un nouvel onglet, votre session reste ouverte.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TutorialChoiceModal;
