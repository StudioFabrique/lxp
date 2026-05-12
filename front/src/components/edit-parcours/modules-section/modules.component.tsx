/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Imports React et React Router
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useSelector } from "react-redux";

// Imports des hooks personnalisés
import useHttp from "../../../hooks/use-http";
import useForm from "../../UI/forms/hooks/use-form";

// Imports des composants
import Wrapper from "../../UI/wrapper/wrapper.component";
import ModuleList from "./module-list";
import CreateModuleForm from "./create-module-form";
import UpdateModuleForm from "./update-module-form";
import Modal from "../../UI/modal/modal";

// Imports des utilitaires et interfaces
import Module from "../../../utils/interfaces/module";
import { sortArray } from "../../../utils/sortArray";

// Imports Redux
import { useDispatch } from "react-redux";
import { parcoursModulesSliceActions } from "../../../store/redux-toolkit/parcours/parcours-modules";

// Import des notifications
import toast from "react-hot-toast";

/**
 * Composant principal pour la gestion des modules d'un parcours
 * Permet d'afficher, créer, modifier et supprimer des modules
 */
const ModulesSection = () => {
  // Hook personnalisé pour la gestion des formulaires
  const {
    values,
    onChangeValue,
    onResetForm,
    errors,
    onValidationErrors,
    initValues,
  } = useForm();

  // Hooks Redux et HTTP
  const dispatch = useDispatch();
  const { isLoading, sendRequest, error } = useHttp();

  // États locaux pour la gestion des modules
  const [formationModules, setFormationModules] = useState<Module[]>([]); // Modules de la formation
  const [toggleForm, setToggleForm] = useState(false); // Contrôle l'affichage du formulaire
  const [newModule, setNewModule] = useState(false); // Indique si on crée un nouveau module
  const [moduleToEdit, setModuleToEdit] = useState<Module | null>(null); // Module en cours d'édition
  const [moduleToDelete, setModuleToDelete] = useState<number | null>(null); // ID du module à supprimer

  // Références et paramètres
  const formRef = useRef<HTMLInputElement>(null);
  const params = useParams();
  const parcoursId = params.id;

  // Sélecteurs Redux
  const formationId = useSelector((state: any) => state.parcours.formation.id);
  const parcoursModules = useSelector(
    (state: any) => state.parcoursModules.modules
  ) as Module[];

  /**
   * Récupère les modules associés à la formation depuis l'API
   */
  const getFormationModules = useCallback(() => {
    const applyData = (data: Module[]) => {
      console.log({ data });

      setFormationModules(sortArray(data, "id", false));
    };
    sendRequest(
      {
        path: `/modules/formation/${formationId}`,
      },
      applyData
    );
  }, [formationId, sendRequest]);

  // Chargement initial des modules
  useEffect(() => {
    getFormationModules();
  }, [getFormationModules]);

  /**
   * Gère la soumission du formulaire de création d'un module
   * @param formData Les données du formulaire
   */
  const handleSubmitModule = (formData: FormData) => {
    const applyData = (data: any) => {
      setNewModule(false);
      setToggleForm(false);
      setFormationModules((prevData) =>
        sortArray([...prevData, data.data], "id", false)
      );
      onResetForm();
    };
    sendRequest(
      {
        path: "/formation/new-module",
        method: "post",
        body: formData,
      },
      applyData
    );
  };

  /**
   * Gère la mise à jour d'un module existant
   * @param formData Les données du formulaire
   */
  const handleUpdateModule = (formData: FormData) => {
    const applyData = (data: any) => {
      // Transformation des données reçues
      const module = {
        ...data.data,
        contacts: data.data.contacts.map((item: any) => item.contact),
        bonusSkills: data.data.bonusSkills.map((item: any) => item.bonusSkill),
      };
      dispatch(parcoursModulesSliceActions.replaceModule(module));
      setModuleToEdit(null);
      setToggleForm(false);
      onResetForm();
    };

    sendRequest(
      {
        path: "/modules/new-module/update",
        method: "put",
        body: formData,
      },
      applyData
    );
  };

  /**
   * Marque un module pour suppression
   * @param moduleId ID du module à supprimer
   */
  const confirmModuleToDelete = (moduleId: number) => {
    setModuleToDelete(moduleId);
  };

  /**
   * Supprime un module du parcours
   */
  const handleDeleteModule = () => {
    const applyData = (_data: Module) => {
      dispatch(parcoursModulesSliceActions.removeModule(moduleToDelete));
      setModuleToDelete(null);
    };
    sendRequest(
      {
        path: `/modules/${moduleToDelete}`,
        method: "delete",
      },
      applyData
    );
  };

  /**
   * Ajoute une copie d'un module de la formation au parcours
   * @param id Identifiant du module à ajouter
   */
  const handleSelectModule = (id: number) => {
    const applyData = (data: any) => {
      dispatch(parcoursModulesSliceActions.addNewModule(data));
    };
    const module = formationModules.find((item) => item.id === id);
    if (module && !toggleForm) {
      sendRequest(
        {
          path: `/modules/add-module/${parcoursId}/${module.id}`,
          method: "put",
        },
        applyData
      );
    }
  };

  /**
   * Active le formulaire de création de module
   */
  const handleCreateModule = () => {
    setNewModule(true);
    setToggleForm(true);
  };

  /**
   * Prépare l'édition d'un module existant
   * @param id Identifiant du module à éditer
   */
  const handleModuleToEdit = (id: number) => {
    const module = parcoursModules.find((item) => item.id === id);
    if (module) {
      setModuleToEdit(module);
    }
    setToggleForm(true);
  };

  /**
   * Annule l'édition ou la création en cours
   */
  const handleCancel = () => {
    setNewModule(false);
    setModuleToEdit(null);
    setToggleForm(false);
    onResetForm();
  };

  // Effet pour mettre à jour l'état du formulaire dans le store Redux
  useEffect(() => {
    dispatch(parcoursModulesSliceActions.setIsFormOpen(toggleForm));
  }, [toggleForm, dispatch]);

  // Effet pour gérer le scroll automatique vers le formulaire
  useEffect(() => {
    let timer: any;
    if ((newModule || moduleToEdit) && formRef && formRef.current) {
      if (moduleToEdit) {
        // Initialisation des valeurs du formulaire pour l'édition
        initValues({
          title: moduleToEdit!.title,
          description: moduleToEdit!.description,
          duration: moduleToEdit!.duration?.toString() ?? "0",
        });
        timer = setTimeout(() => {
          formRef.current!.scrollIntoView({ behavior: "smooth" });
          formRef.current!.focus();
        }, 100);
      }
      formRef.current!.scrollIntoView({ behavior: "smooth" });
      formRef.current!.click();
    }
    return () => clearTimeout(timer);
  }, [newModule, initValues, moduleToEdit]);

  // Effet pour la gestion des erreurs HTTP avec toast notifications
  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
    }
  }, [error]);

  return (
    <>
      <div className="flex flex-col gap-y-8">
        {/* Titre de la section */}
        <section>
          <h1 className="text-3xl font-extrabold">Modules</h1>
        </section>

        {/* Grille des listes de modules */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Liste des modules de la formation */}
            <Wrapper>
              <ModuleList
                isSourceList={true}
                isLoading={isLoading}
                modules={formationModules}
                label="Modules disponibles"
                onEdit={() => {}}
                onSelect={handleSelectModule}
                onDelete={confirmModuleToDelete}
              />
            </Wrapper>
            {/* Liste des modules du parcours */}
            <Wrapper>
              <ModuleList
                isSourceList={false}
                isLoading={isLoading}
                modules={parcoursModules}
                label="Modules du parcours"
                onEdit={handleModuleToEdit}
                onSelect={() => {}}
                onDelete={confirmModuleToDelete}
              />
            </Wrapper>
          </div>
        </section>

        {/* Bouton de création de module */}
        <section>
          <div className="w-full flex justify-between">
            <button
              className="btn btn-outline btn-primary"
              onClick={handleCreateModule}
              disabled={toggleForm}
            >
              Créer un nouveau module
            </button>
          </div>
        </section>

        {/* Formulaires conditionnels */}
        {toggleForm ? (
          <>
            {/* Formulaire de création */}
            {newModule ? (
              <Wrapper>
                <CreateModuleForm
                  useForm={{
                    values,
                    onChangeValue,
                    onValidationErrors,
                    errors,
                  }}
                  isLoading={isLoading}
                  onCancel={handleCancel}
                  onSubmit={handleSubmitModule}
                  ref={formRef}
                />
              </Wrapper>
            ) : (
              /* Formulaire de mise à jour */
              <Wrapper>
                <UpdateModuleForm
                  useForm={{
                    values,
                    onChangeValue,
                    onValidationErrors,
                    errors,
                  }}
                  currentModule={moduleToEdit}
                  onSubmit={handleUpdateModule}
                  isLoading={isLoading}
                  ref={formRef}
                  onCancel={handleCancel}
                />
              </Wrapper>
            )}
          </>
        ) : null}
      </div>

      {/* Modal de confirmation de suppression */}
      {moduleToDelete ? (
        <Modal
          onLeftClick={() => setModuleToDelete(null)}
          onRightClick={handleDeleteModule}
          title="Supprimer un module"
          isSubmitting={false}
          leftLabel="Annuler"
          rightLabel="Confirmer"
        >
          Attention le module et les ressources qui lui sont associées seront
          définitivement supprimés.
        </Modal>
      ) : null}
    </>
  );
};

export default ModulesSection;
