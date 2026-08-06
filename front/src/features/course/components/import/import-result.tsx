import {
  AlertCircle,
  Check,
  CheckCircle2,
  CircleDashed,
  FileArchive,
  LoaderCircle,
  RotateCcw,
  XCircle,
} from "lucide-react";
import type {
  CourseImport,
  ImportProgressItem,
} from "../../hooks/useImportCourses";
import Header from "../../../../components/headers/Header";
import { Link } from "react-router";
import { cn } from "../../../../utils/cn";

type Props = {
  importedCourses: CourseImport[];
  progress: number;
  currentAction: string;
  moduleId?: number;
  items: ImportProgressItem[];
  criticalError: string;
  isImporting: boolean;
  isComplete: boolean;
  onRetry: () => void;
};

const ImportResult = ({
  importedCourses,
  progress,
  currentAction,
  moduleId,
  items,
  criticalError,
  isImporting,
  isComplete,
  onRetry,
}: Props) => {
  const parcoursTitle = importedCourses[0]?.parcours?.title;
  const successCount = items.filter((item) => item.status === "success").length;
  const pendingCount = items.filter((item) => item.status === "pending").length;
  const errorCount = items.filter((item) => item.status === "error").length;

  const statusIcon = (item: ImportProgressItem) => {
    switch (item.status) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case "error":
        return <XCircle className="h-5 w-5 text-error" />;
      case "processing":
        return <LoaderCircle className="h-5 w-5 animate-spin text-primary" />;
      default:
        return <CircleDashed className="h-5 w-5 text-base-content/35" />;
    }
  };

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
        title={
          criticalError
            ? "Importation interrompue"
            : isComplete
              ? "Importation terminée"
              : "Traitement de l'importation..."
        }
        description={
          criticalError
            ? criticalError
            : isComplete
              ? "Tous les contenus ont été traités avec succès."
              : `Les cours sélectionnés sont en cours d'importation${parcoursTitle ? " dans le parcours " + parcoursTitle : ""}. Merci de ne pas quitter ou recharger la page.`
        }
        alternateBgColor={!isComplete}
        isSubHeader
        hasError={Boolean(criticalError)}
        successBgColor={isComplete}
      >
        {criticalError ? (
          <XCircle className="h-6 w-6 text-error" />
        ) : isComplete ? (
          <Check className="h-6 w-6 text-success" />
        ) : isImporting ? (
          <LoaderCircle className="h-6 w-6 animate-spin text-primary" />
        ) : null}
      </Header>

      <div className="flex min-h-75 flex-col gap-6 p-6 sm:p-8">
        {isComplete ? (
          <div className="flex flex-col items-center gap-4 animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-success/20 text-success rounded-full flex items-center justify-center">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-success">
              Importation réussie !
            </h3>
            <p>Tous les cours et activités ont été créés.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-primary">
                {criticalError ? "Progression arrêtée" : "Importation en cours"}
              </h2>
              <span className="font-mono text-sm text-base-content/60">
                {Math.round(progress)}%
              </span>
            </div>
            <progress
              className={cn(
                "progress h-3 w-full",
                criticalError ? "progress-error" : "progress-primary",
              )}
              value={progress}
              max="100"
            />
            <p className="text-sm text-base-content/70">{currentAction}</p>
          </div>
        )}

        {criticalError && (
          <div className="alert alert-error alert-soft">
            <AlertCircle className="h-5 w-5" />
            <div>
              <p className="font-semibold">Erreur critique</p>
              <p className="text-sm">{criticalError}</p>
            </div>
          </div>
        )}

        <section className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FileArchive className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">
                Contenu des archives .mbz importées
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="badge badge-success badge-soft">
                {successCount} réussi{successCount > 1 ? "s" : ""}
              </span>
              {errorCount > 0 && (
                <span className="badge badge-error badge-soft">
                  {errorCount} échoué{errorCount > 1 ? "s" : ""}
                </span>
              )}
              <span className="badge badge-ghost">
                {pendingCount} en attente
              </span>
            </div>
          </div>

          <div className="max-h-96 divide-y divide-base-200 overflow-y-auto rounded-lg border border-base-300">
            {items.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "flex items-start gap-3 px-4 py-3",
                  item.kind === "course" ? "bg-base-200/70" : "ml-6 pl-4",
                  item.status === "error" && "bg-error/5",
                  item.status === "processing" && "bg-primary/5",
                )}
              >
                <span className="mt-0.5 shrink-0">{statusIcon(item)}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p className="truncate text-sm font-semibold">
                      {item.title}
                    </p>
                    {item.kind === "course" && (
                      <span className="badge badge-xs badge-outline">
                        Cours
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs text-base-content/55">
                    {item.context}
                    {item.filename ? ` · ${item.filename}` : ""}
                  </p>
                  {item.error && (
                    <p className="mt-1 text-xs text-error">{item.error}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {!criticalError && !isComplete && (
          <div className="alert alert-outline text-xs">
            <AlertCircle />
            <span>
              Ne fermez pas cette page. Les fichiers sont en cours de transfert.
            </span>
          </div>
        )}

        {(criticalError || isComplete) && (
          <div className="flex flex-wrap justify-end gap-3 border-t border-base-300 pt-5">
            <Link
              className={cn("btn", isComplete ? "btn-success" : "btn-outline")}
              to={`/admin/parcours/module/${moduleId}`}
            >
              Terminer
            </Link>
            {criticalError && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => onRetry()}
              >
                <RotateCcw className="h-4 w-4" />
                Réessayer
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportResult;
