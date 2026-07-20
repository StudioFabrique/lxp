import { AlertCircle, Check } from "lucide-react";
import { CourseImport } from "../../hooks/useImportCourses";
import Header from "../../../../components/headers/Header";
import Loader from "../../../../components/loaders/Loader";
import { Link } from "react-router";

type Props = {
  importedCourses: CourseImport[];
  progress: number;
  currentAction: string;
  moduleId?: number;
};

const ImportResult = ({
  importedCourses,
  progress,
  currentAction,
  moduleId,
}: Props) => {
  const parcoursTitle = importedCourses[0]?.parcours?.title;
  const isFinished = progress === 100;

  return (
    <div className="flex flex-col gap-6 ml-5 animate-in fade-in duration-500">
      <Header
        title="Première étape"
        description="Importer le fichier d'import de cours en .mbz"
        successBgColor
        isSubHeader
        disabled
      />
      <Header
        title="Seconde étape"
        description="Sélectionner le contenu pédagogique à importer"
        successBgColor
        isSubHeader
        disabled
      />
      <Header
        title="Dernière étape"
        description="Sélectionner le parcours auquels les cours seront rattachés"
        successBgColor
        isSubHeader
        disabled
      />
      <Header
        title="Traitement de l'importation..."
        description={`Les cours selectionnés sont en cours d'importation${parcoursTitle ? " dans le parcours " + parcoursTitle : ""}. Merci de ne pas quitter ou recharger la page.`}
        alternateBgColor
        isSubHeader
      >
        {!isFinished ? <Loader /> : <Check />}
      </Header>

      <div className="bg-base-100 p-8 rounded-lg border border-secondary flex flex-col gap-6 items-center justify-center min-h-75">
        {!isFinished ? (
          <>
            <h2 className="text-xl font-bold text-primary">
              Importation en cours...
            </h2>

            {/* Barre de progression DaisyUI */}
            <progress
              className="progress progress-primary w-full max-w-md h-4"
              value={progress}
              max="100"
            ></progress>

            <div className="flex flex-col items-center gap-1 text-sm text-base-content/70">
              <span className="font-mono">{Math.round(progress)}%</span>
              <span>{currentAction}</span>
            </div>

            <div className="alert alert-outline outline-2 max-w-md text-xs mt-4">
              <AlertCircle />
              <span>
                Ne fermez pas cette page. Les fichiers sont en cours de
                transfert.
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-success/20 text-success rounded-full flex items-center justify-center">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-success">
              Importation réussie !
            </h3>
            <p>Tous les cours et activités ont été créés.</p>
            <Link
              className="btn btn-success mt-4"
              to={`/admin/parcours/module/${moduleId}`}
            >
              Terminer
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportResult;
