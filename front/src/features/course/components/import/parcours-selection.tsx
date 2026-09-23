import { formatTitle } from "../../../../utils/helpers/text-helpers";
import {
  GraduationCap,
  ArrowRight,
  Rocket,
  Component,
  Undo2,
  RefreshCw,
} from "lucide-react";
import Parcours from "../../../../utils/interfaces/parcours";
import Formation from "../../../../utils/interfaces/formation";
import Header from "../../../../components/headers/Header";
import { Link } from "react-router";
import Module from "../../../../utils/interfaces/module";
import { useContext, useState } from "react";
import SelectableSubCard from "../../../../components/UI/selectable-sub-card";
import FloatingBottomNavigation from "../../../../components/buttons/FloatingBottomNavigation";
import { AuthContext } from "../../../../store/AuthProvider";
import { isTeacherUser } from "../../../../utils/helpers/user-role";

type Props = {
  formationsList: Formation[];
  isFormationsLoading: boolean;
  formationsError: string;
  selectedFormation: Formation | null;
  onSelectFormation: (formation: Formation) => void;

  parcoursList: Parcours[];
  selectedParcours: Parcours | null;
  onSelectParcours: (parcours: Parcours | null) => void;

  modulesList: Module[];
  selectedModule: Module | null;
  onSelectModule: (module: Module | null) => void;
  onRefreshFormations: () => void;
  onRefreshParcours: () => void;
  onRefreshModules: () => void;

  onConfirm: (parcours?: Parcours | null) => void;
  onGoBack: () => void;
};

const ParcoursSelection = ({
  formationsList,
  isFormationsLoading,
  formationsError,
  selectedFormation,
  onSelectFormation,
  parcoursList,
  selectedParcours,
  onSelectParcours,
  modulesList,
  selectedModule,
  onSelectModule,
  onRefreshFormations,
  onRefreshParcours,
  onRefreshModules,
  onConfirm,
  onGoBack,
}: Props) => {
  const { user } = useContext(AuthContext);
  const isTeacher = isTeacherUser(user);
  const [showReloadModulesButton, setShowReloadModulesButton] = useState(false);
  const [showReloadFormationsButton, setShowReloadFormationsButton] =
    useState(false);
  const [showReloadParcoursButton, setShowReloadParcoursButton] =
    useState(false);

  const canConfirm = Boolean(
    selectedFormation && selectedParcours && selectedModule,
  );

  const onClickLink = () => {
    setShowReloadModulesButton(true);
  };

  return (
    <div
      className="flex flex-col gap-4 ml-5 animate-in fade-in duration-500"
      data-course-import-tour="assignment"
    >
      <Header
        title="Première étape"
        description="Téléverser un dossier compressé de format .zip"
        successBgColor
        isSubHeader
        disabled
        onClick={onGoBack}
      />

      <Header
        title="Seconde étape"
        description="Selectionner le parcours auquels les modules seront rattachés"
        isSubHeader
        alternateBgColor
      >
        {selectedModule && (
          <div className="flex font-bold text-sm items-center gap-2 mr-5">
            <span>Module choisi :</span>
            <Link
              data-tip="Ouverture dans un nouvel onglet"
              className="link hover:text-secondary tooltip tooltip-bottom"
              to={`/admin/parcours/module/${selectedModule.id}`}
              target="_blank"
            >
              {formatTitle(selectedModule.title)}
            </Link>
          </div>
        )}
      </Header>

      <div className="ml-10 flex flex-col gap-6 pb-10">
        <div
          className="flex flex-col bg-base-200 p-4 rounded-lg gap-4 animate-in slide-in-from-top-4 duration-300"
          data-course-import-tour="formation"
        >
          <h3 className="text-lg font-bold flex items-center gap-2 text-base-content">
            Choisir une formation
            {showReloadFormationsButton && (
              <button
                type="button"
                className="btn btn-xs btn-ghost tooltip ml-auto"
                data-tip="Recharger la liste des formations"
                onClick={onRefreshFormations}
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </h3>

          {isFormationsLoading ? (
            <div role="status" aria-label="Chargement des formations" className="space-y-3">
              <span className="sr-only">Chargement des formations…</span>
              <div className="skeleton h-10 w-full" />
              <div className="skeleton h-10 w-full" />
            </div>
          ) : formationsError ? (
            <div className="alert alert-error text-sm">{formationsError}</div>
          ) : formationsList.length === 0 ? (
            <div className="flex px-5 text-sm text-base-content">
              <span>Aucune formation existante</span>
              {!isTeacher && (
                <Link
                  className="btn btn-primary btn-sm ml-auto normal-case"
                  to="/admin/parcours?createFormation=true"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setShowReloadFormationsButton(true)}
                >
                  Créer une formation
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formationsList.map((formation) => {
                const isSelected = selectedFormation?.id === formation.id;

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

        {selectedFormation && (
          <div
            className="flex flex-col bg-base-200 p-4 rounded-lg gap-4 animate-in slide-in-from-top-4 duration-300"
            data-course-import-tour="parcours"
          >
            <h3 className="text-lg font-bold flex items-center gap-2 text-base-content">
              Choisir un parcours pour :
              <span className="text-primary underline decoration-dotted capitalize">
                {formatTitle(selectedFormation.title)}
              </span>
              {showReloadParcoursButton && (
                <button
                  type="button"
                  className="btn btn-xs btn-ghost tooltip ml-auto"
                  data-tip="Recharger la liste des parcours"
                  onClick={onRefreshParcours}
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </h3>

            {parcoursList.length === 0 ? (
              <div className="flex items-center px-5 text-sm">
                <span>Aucun parcours disponible pour cette formation.</span>
                {!isTeacher && (
                  <Link
                    className="btn btn-primary btn-sm ml-auto normal-case"
                    to={`/admin/dashboard?createParcours=true&formationId=${selectedFormation.id}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setShowReloadParcoursButton(true)}
                  >
                    Créer un parcours
                  </Link>
                )}
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

        {selectedParcours && (
          <div
            className="flex flex-col gap-4 bg-base-200 p-4 rounded-lg animate-in slide-in-from-top-4 duration-300"
            data-course-import-tour="module"
          >
            <h3 className="text-lg font-bold flex items-center gap-2 text-base-content">
              {isTeacher
                ? "Choisir parmi mes modules pour :"
                : "Choisir un module pour :"}
              <Link
                to={`/admin/parcours/edit/${selectedParcours.id}?step=4`}
                target="_blank"
                data-tip="Ouverture dans un nouvel onglet"
                className="text-primary underline decoration-dotted tooltip capitalize"
                onClick={onClickLink}
              >
                {formatTitle(selectedParcours.title)}
              </Link>
              {showReloadModulesButton && (
                <button
                  type="button"
                  className="btn btn-xs btn-ghost tooltip"
                  data-tip={
                    isTeacher
                      ? "Recharger mes modules"
                      : "Recharger la liste des modules"
                  }
                  onClick={onRefreshModules}
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </h3>

            {modulesList?.length === 0 ? (
              <div className="alert alert-warning bg-warning/10 text-error border-warning/20 text-sm">
                {isTeacher
                  ? "Aucun de mes modules n'est disponible pour ce parcours."
                  : "Aucun module disponible pour ce parcours."}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {modulesList?.map((module) => {
                  const isSelected = selectedModule?.id === module.id;
                  return (
                    <SelectableSubCard
                      key={module.id}
                      data={module}
                      icon={<Component size={20} />}
                      isSelected={isSelected}
                      onSelect={onSelectModule}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
      <FloatingBottomNavigation
        startActions={
          <button className="btn btn-outline" onClick={onGoBack}>
            <Undo2 size={18} /> Retour
          </button>
        }
        endActions={
          <button
            data-course-import-tour="assignment-actions"
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
