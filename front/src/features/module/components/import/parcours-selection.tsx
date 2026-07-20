import { GraduationCap, Ban, ArrowRight, Rocket, Undo2 } from "lucide-react";
import { Link } from "react-router";
import Parcours from "../../../../utils/interfaces/parcours";
import Formation from "../../../../utils/interfaces/formation";
import Header from "../../../../components/headers/Header";
import SelectableSubCard from "../../../../components/UI/selectable-sub-card";
import FloatingBottomNavigation from "../../../../components/buttons/FloatingBottomNavigation";

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
  // Détermine si le bouton de confirmation d'importation est activé
  const canConfirm = Boolean(selectedFormation && selectedParcours);

  const handleConfirmWithoutParcours = () => {
    onSelectParcours(null);
    onConfirm(null);
  };

  return (
    <div className="flex flex-col gap-4 ml-5 animate-in fade-in duration-500">
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
        description="Sélectionner le parcours auquel les modules seront rattachés"
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
      </Header>

      <div className="ml-10 flex flex-col gap-6 pb-10">
        {/* --- SECTION 1 : FORMATIONS --- */}
        <div className="flex flex-col bg-base-200 p-4 rounded-lg gap-4 animate-in slide-in-from-top-4 duration-300">
          <h3 className="text-lg font-bold flex items-center gap-2 text-base-content">
            Choisir une formation
          </h3>

          {formations.length === 0 ? (
            <div className="alert">Chargement des formations...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formations.map((formation) => {
                const isSelected = selectedFormation?.id === formation.id;
                // Vérification de sécurité sur l'ID
                if (!formation.id) return null;

                return (
                  <SelectableSubCard
                    key={formation.id}
                    data={formation}
                    icon={<GraduationCap size={20} />}
                    isSelected={isSelected}
                    onSelect={onSelectFormation}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* --- SECTION 2 : PARCOURS (Apparait si formation sélectionnée) --- */}
        {selectedFormation && (
          <div className="flex flex-col bg-base-200 p-4 rounded-lg gap-4 animate-in slide-in-from-top-4 duration-300">
            <h3 className="text-lg font-bold flex items-center gap-2 text-base-content">
              Choisir un parcours pour :
              <span className="text-primary underline decoration-dotted capitalize">
                {selectedFormation.title}
              </span>
            </h3>

            {parcoursList.length === 0 ? (
              <div className="alert alert-warning bg-warning/10 text-error border-warning/20 text-sm">
                Aucun parcours disponible pour cette formation.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {parcoursList.map((parcours) => {
                  const isSelected = selectedParcours?.id === parcours.id;
                  return (
                    <SelectableSubCard
                      key={parcours.id}
                      data={parcours}
                      icon={<Rocket size={20} />}
                      isSelected={isSelected}
                      onSelect={onSelectParcours}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* --- SECTION 3 : STANDALONE (Spécifique à ce composant) --- */}
        <div className="divider text-base-content/30 text-xs">OU</div>

        <div className="flex justify-center animate-in fade-in duration-500">
          <button
            onClick={handleConfirmWithoutParcours}
            className="btn btn-outline hover:bg-base-200 text-base-content/60 hover:text-error gap-2 normal-case font-normal border-base-300 hover:border-error"
          >
            <Ban size={18} />
            Lancer l'importation sans rattacher à un parcours
          </button>
        </div>
      </div>
      <FloatingBottomNavigation
        startActions={
          <button className="btn btn-ghost hover:underline" onClick={onGoBack}>
            <Undo2 size={18} /> Retour
          </button>
        }
        endActions={
          <button
            className="btn btn-success gap-2"
            disabled={!canConfirm}
            onClick={() => onConfirm(selectedParcours)}
          >
            Lancer l'importation <ArrowRight size={18} />
          </button>
        }
      />
    </div>
  );
};

export default ParcoursSelection;
