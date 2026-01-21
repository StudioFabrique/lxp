import {
  GraduationCap,
  Waypoints,
  Ban,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Parcours from "../../utils/interfaces/parcours";
import Formation from "../../utils/interfaces/formation";
import Header from "../UI/header";

type Props = {
  formations: Formation[];
  selectedFormation: Formation | null;
  onSelectFormation: (formation: Formation) => void;

  parcoursList: Parcours[];
  selectedParcours: Parcours | null;
  onSelectParcours: (parcours: Parcours) => void;

  onConfirm: () => void;
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
  // Détermine si le bouton final est activé
  // Activé si : (Formation ET Parcours choisis) OU (Aucune formation -> mode standalone implicite via bouton dédié)
  const canConfirm = !!(selectedFormation && selectedParcours);

  return (
    <div className="flex flex-col gap-6 ml-5 animate-in fade-in duration-500">
      {/* Header Etape 1 */}
      <Header
        title="Première étape"
        description="Téléverser un dossier compressé de format .zip"
        successBgColor
        disabled
        onClick={onGoBack}
      />

      {/* Header Etape 2 */}
      <Header
        title="Seconde étape"
        description="Selectionner le parcours auquels les modules seront rattachés"
        alternateBgColor
      >
        <button
          className="btn btn-primary gap-2"
          disabled={!canConfirm}
          onClick={onConfirm}
        >
          Lancer l'importation <ArrowRight size={18} />
        </button>
      </Header>

      <div className="flex flex-col gap-8 pb-10">
        {/* --- SECTION 1 : FORMATIONS --- */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold flex items-center gap-2 text-base-content">
            <GraduationCap className="text-primary" />
            Choisissez une formation
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
                    className={`
                                    card bg-base-100 shadow-sm border cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1
                                    ${isSelected ? "border-primary ring-1 ring-primary" : "border-base-200 hover:border-primary/50"}
                                `}
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
              <Waypoints className="text-secondary" />
              Choisissez un parcours pour :{" "}
              <span className="text-primary underline decoration-dotted">
                {selectedFormation.title}
              </span>
            </h3>

            {parcoursList.length === 0 ? (
              <div className="alert alert-warning bg-warning/10 text-warning-content border-warning/20 text-sm">
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
                      className={`
                                        card bg-base-100 shadow-sm border cursor-pointer transition-all duration-200
                                        ${isSelected ? "border-secondary ring-1 ring-secondary bg-secondary/5" : "border-base-200 hover:border-secondary/50"}
                                    `}
                    >
                      <div className="card-body p-4 flex flex-row items-center gap-3">
                        <div
                          className={`p-2 rounded-full ${isSelected ? "bg-secondary text-white" : "bg-base-200 text-base-content/50"}`}
                        >
                          <Waypoints size={20} />
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
            onClick={onConfirm} // On confirme directement sans parcours selectionné (selectedParcours est null ici)
            className="btn btn-ghost hover:bg-base-200 text-base-content/60 hover:text-error gap-2 normal-case font-normal"
          >
            <Ban size={18} />
            Continuer sans rattacher à un parcours (Modules orphelins)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParcoursSelection;
