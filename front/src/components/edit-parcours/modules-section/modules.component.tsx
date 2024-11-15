/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import useHttp from "../../../hooks/use-http";
import Wrapper from "../../UI/wrapper/wrapper.component";
import Module from "../../../utils/interfaces/module";
import { useDispatch } from "react-redux";
import { parcoursModulesSliceActions } from "../../../store/redux-toolkit/parcours/parcours-modules";
import ModuleList from "./module-list";
import { sortArray } from "../../../utils/sortArray";
import CreateModuleForm from "./create-module-form";
import useForm from "../../UI/forms/hooks/use-form";
import UpdateModuleForm from "./update-module-form";
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

  const dispatch = useDispatch();
  const { isLoading, sendRequest, error } = useHttp();

  // États locaux
  const [formationModules, setFormationModules] = useState<Module[]>([]); // Modules de la formation
  const params = useParams();
  const parcoursId = params.id;
  const formationId = useSelector((state: any) => state.parcours.formation.id);
  const formRef = useRef<HTMLInputElement>(null);
  const [toggleForm, setToggleForm] = useState(false); // Contrôle l'affichage du formulaire
  const [newModule, setNewModule] = useState(false); // Indique si on crée un nouveau module
  const parcoursModules = useSelector(
    (state: any) => state.parcoursModules.modules
  ) as Module[];
  const [moduleToEdit, setModuleToEdit] = useState<Module | null>(null);

  /**
   * Récupère les modules associés à la formation depuis l'API
   */
  const getFormationModules = useCallback(() => {
    const applyData = (data: Module[]) => {
      setFormationModules(sortArray(data, "id", false));
    };
    sendRequest(
      {
        path: `/modules/formation/${formationId}`,
      },
      applyData
    );
  }, [formationId, sendRequest]);

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
   * Supprime un module du parcours
   * @param id Identifiant du module à supprimer
   */
  const handleDeleteModule = (id: number) => {
    const applyData = (_data: Module) => {
      dispatch(parcoursModulesSliceActions.removeModule(id));
    };
    sendRequest(
      {
        path: `/modules/${id}`,
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

  // Met à jour l'état du formulaire dans le store Redux
  useEffect(() => {
    dispatch(parcoursModulesSliceActions.setIsFormOpen(toggleForm));
  }, [toggleForm, dispatch]);

  // Gère le scroll automatique vers le formulaire
  useEffect(() => {
    let timer: any;
    if ((newModule || moduleToEdit) && formRef && formRef.current) {
      if (moduleToEdit) {
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
      formRef.current!.focus();
    }
    return () => clearTimeout(timer);
  }, [newModule, initValues, moduleToEdit]);

  // Gestion des erreurs HTTP avec toast notifications
  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="flex flex-col gap-y-8">
      {/* Titre de la section */}
      <section>
        <h1 className="text-3xl font-extrabold">Modules</h1>
      </section>

      {/* Grille des listes de modules */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Wrapper>
            <ModuleList
              isSourceList={true}
              isLoading={isLoading}
              modules={formationModules}
              label="Modules de la formation"
              onEdit={() => {}}
              onSelect={handleSelectModule}
              onDelete={handleDeleteModule}
            />
          </Wrapper>
          <Wrapper>
            <ModuleList
              isSourceList={false}
              isLoading={isLoading}
              modules={parcoursModules}
              label="Modules du parcours"
              onEdit={handleModuleToEdit}
              onSelect={() => {}}
              onDelete={handleDeleteModule}
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
            Créer un module
          </button>
        </div>
      </section>

      {/* Formulaires conditionnels */}
      {toggleForm ? (
        <>
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
  );
};

export default ModulesSection;
