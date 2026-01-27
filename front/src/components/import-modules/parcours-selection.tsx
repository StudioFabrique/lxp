import {
  GraduationCap,
  Ban,
  CheckCircle2,
  ArrowRight,
  Rocket,
} from "lucide-react";
import Parcours from "../../utils/interfaces/parcours";
import Formation from "../../utils/interfaces/formation";
import Header from "../UI/header";
import { Link } from "react-router-dom";

type Props = {
  formations: Formation[];
  selectedFormation: Formation | null;
  onSelectFormation: (formation: Formation) => void;

  parcoursList: Parcours[];
  selectedParcours: Parcours | null;
  onSelectParcours: (parcours: Parcours | null) => void;

  onConfirm: (parcours?: Parcours | null) => void;
  onGoBack: () => void;
};

const ParcoursSelection = ({
  formations,
  selectedFormation,
  onSelectFormation,
  parcoursList,
  selectedParcours,
  onSelectParcours,
  onConfirm,
  onGoBack,
}: Props) => {
  // Détermine si le bouton de confirmation d'i,portation est activé
  const canConfirm = Boolean(selectedFormation && selectedParcours);

  const handleConfirmWithoutParcours = () => {
    onSelectParcours(null);
    onConfirm(null);
  };

  return (
    <div className="flex flex-col gap-6 ml-5 animate-in fade-in duration-500">
      {/* Header Etape 1 */}
      <Header
        title="Première étape"
        description="Téléverser un dossier compressé de format .zip"
        successBgColor
        isSubHeader
        disabled
        onClick={onGoBack}
      />

      {/* Header Etape 2 */}
      <Header
        title="Seconde étape"
        description="Selectionner le parcours auquels les modules seront rattachés"
        isSubHeader
        alternateBgColor
      >
        {selectedParcours && (
          <div className="flex font-bold text-sm items-center gap-2 mr-5">
            <span>Parcours choisi :</span>
            <Link
              data-tip="Ouverture dans un nouvel onglet"
              className="link hover:text-secondary tooltip tooltip-bottom"
              to={`/admin/parcours/view/${selectedParcours.id}`}
              target="_blank"
            >
              {selectedParcours.title}
            </Link>
          </div>
        )}
        <button
          className="btn btn-sm btn-success gap-2"
          disabled={!canConfirm}
          onClick={() => onConfirm(selectedParcours)}
        >
          Lancer l'importation <ArrowRight size={18} />
        </button>
      </Header>

      <div className="ml-10 flex flex-col gap-8 pb-10">
        {/* --- SECTION 1 : FORMATIONS --- */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold flex items-center gap-2 text-base-content">
            Choisir une formation
          </h3>

          {formations.length === 0 ? (
            <div className="alert">Chargement des formations...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[300px] overflow-y-auto custom-scrollbar p-1">
              {formations.map((formation) => {
                const isSelected = selectedFormation?.id === formation.id;
                return (
                  <div
                    key={formation.id}
                    onClick={() => onSelectFormation(formation)}
                    className={`card bg-base-300 shadow-sm border cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1 ${isSelected ? "border-primary ring-1 ring-primary" : "border-base-200 hover:border-primary/50"}`}
                  >
                    <div className="card-body p-4 flex flex-row items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${isSelected ? "bg-primary text-white" : "bg-base-200 text-base-content/50"}`}
                      >
                        <GraduationCap size={20} />
                      </div>
                      <span
                        className={`font-medium text-sm line-clamp-2 ${isSelected ? "text-primary" : "text-base-content"}`}
                      >
                        {formation.title}
                      </span>
                      {isSelected && (
                        <CheckCircle2
                          size={16}
                          className="text-primary ml-auto"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* --- SECTION 2 : PARCOURS (Apparait si formation sélectionnée) --- */}
        {selectedFormation && (
          <div className="flex flex-col gap-4 animate-in slide-in-from-top-4 duration-300">
            <h3 className="text-lg font-bold flex items-center gap-2 text-base-content">
              Choisir un parcours pour :
              <span className="text-primary underline decoration-dotted">
                {selectedFormation.title}
              </span>
            </h3>

            {parcoursList.length === 0 ? (
              <div className="alert alert-warning bg-warning/10 text-warning border-warning/20 text-sm">
                Aucun parcours disponible pour cette formation.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {parcoursList.map((parcours) => {
                  const isSelected = selectedParcours?.id === parcours.id;
                  return (
                    <div
                      key={parcours.id}
                      onClick={() => onSelectParcours(parcours)}
                      className={`card bg-base-100 shadow-sm border cursor-pointer transition-all duration-200 ${isSelected ? "border-secondary ring-1 ring-secondary bg-secondary/5" : "border-base-200 hover:border-secondary/50"}`}
                    >
                      <div className="card-body p-4 flex flex-row items-center gap-3">
                        <div
                          className={`p-2 rounded-full ${isSelected ? "bg-secondary text-white" : "bg-base-200 text-base-content/50"}`}
                        >
                          <Rocket size={20} />
                        </div>
                        <span
                          className={`font-medium text-sm ${isSelected ? "text-secondary-focus" : "text-base-content"}`}
                        >
                          {parcours.title}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* --- SECTION 3 : STANDALONE --- */}
        <div className="divider text-base-content/30 text-xs">OU</div>

        <div className="flex justify-center">
          <button
            onClick={handleConfirmWithoutParcours}
            className="btn btn-outline hover:bg-base-200 text-base-content/60 hover:text-error gap-2 normal-case font-normal"
          >
            <Ban size={18} />
            Lancer l'importation sans rattacher à un parcours
          </button>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onGoBack}
            className="btn btn-ghost hover:bg-base-200 text-base-content/60 hover:text-error gap-2 normal-case font-normal"
          >
            Retourner à la prévisualisation des modules
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParcoursSelection;
