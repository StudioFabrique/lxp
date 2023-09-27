import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import useHttp from "../../../hooks/use-http";
import Wrapper from "../../UI/wrapper/wrapper.component";
import DragNDropArea from "./drag-n-drop-area";
import Module from "../../../utils/interfaces/module";
import ModuleForm from "./module-form.component";
import { useDispatch } from "react-redux";
import Loader from "../../UI/loader";
import { parcoursModulesSliceActions } from "../../../store/redux-toolkit/parcours/parcours-modules";

const ModulesSection = () => {
  const { isLoading, sendRequest } = useHttp();
  const [formationModules, setFormationModules] = useState<any>([]);
  const params = useParams();
  const parcoursId = params.id;
  const updatedModules = useSelector(
    (state: any) => state.parcoursModules.modules
  );
  const formationId = useSelector((state: any) => state.parcours.formation.id);
  const dispatch = useDispatch();
  const currentModule = useSelector(
    (state: any) => state.parcoursModules.currentModule
  ) as Module;
  const formRef = useRef<HTMLInputElement>(null);
  const editionMode = useSelector(
    (state: any) => state.parcoursModules.editionMode
  );
  const newModule = useSelector(
    (state: any) => state.parcoursModules.newModule
  );

  const getFormationModules = useCallback(() => {
    console.log("fetching");

    const applyData = (data: Module[]) => {
      const modules = data.map((module) => ({
        ...module,
        id: module.id!.toString(),
      }));
      setFormationModules(modules);
      console.log({ modules });
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

  // mise à jour de la liste des modules du parcours dans la bdd et mise à jour du state en cas de réussite
  const handleSubmitModules = () => {
    console.log({ updatedModules });

    const applyData = (data: any) => {
      //dispatch(setModules(data));
    };
    sendRequest(
      {
        path: `/modules/${parcoursId}`,
        method: "put",
        body: updatedModules.map((item: Module) => +item.id!),
      },
      applyData
    );
  };

  const handleCreateModule = () => {
    dispatch(
      parcoursModulesSliceActions.setCurrentModule({
        title: "",
        description: "",
        duration: "",
      })
    );
    dispatch(parcoursModulesSliceActions.toggleNewModule(true));
  };

  const handleSubmitModule = (formData: FormData) => {
    const applyData = (data: any) => {
      console.log(data);
      const module = {
        ...data.data,
        id: data.data.id.toString(),
        contacts: data.data.contacts.map(
          (itemContact: any) => itemContact.contact
        ),
        bonusSkills: data.data.bonusSkills.map(
          (itemBonusSkills: any) => itemBonusSkills.bonusSkill
        ),
      };
      dispatch(parcoursModulesSliceActions.addNewModule(module));
      dispatch(parcoursModulesSliceActions.setCurrentModule(null));
      dispatch(parcoursModulesSliceActions.toggleNewModule(false));

      console.log("fini");
    };
    sendRequest(
      {
        path: "/modules/new-module",
        method: "put",
        body: formData,
      },
      applyData
    );
  };

  const handleUpdateModule = (formData: FormData) => {
    const applyData = (data: any) => {
      const updatedModule = {
        ...data.data,
        id: data.data.id.toString(),
        bonusSkills: data.data.bonusSkills.map((item: any) => item.bonusSkill),
        contacts: data.data.contacts.map((item: any) => item.contact),
      };
      dispatch(parcoursModulesSliceActions.editModule(updatedModule));
      dispatch(parcoursModulesSliceActions.toggleEditionMode(false));
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
   * efface une copie de module rattachée au parcours et toutes ses relations avec les compétences et les contacts
   * @param id string
   */
  const handleDeleteModule = (id: string) => {
    console.log(formationModules);

    if (formationModules.includes(+id)) {
      dispatch(parcoursModulesSliceActions.removeModule(id));
      getFormationModules();
    }
    const applyData = (data: Module) => {
      dispatch(parcoursModulesSliceActions.removeModule(data.id!.toString()));
      getFormationModules();
    };

    sendRequest(
      {
        path: `/modules/${id}`,
        method: "delete",
      },
      applyData
    );
  };

  // scroll jusqu'au premier champ du formulaire qd ce dernier est ouvert
  useEffect(() => {
    if (currentModule && formRef && (editionMode || newModule)) {
      formRef.current!.scrollIntoView({ behavior: "smooth" });
      formRef.current!.focus();
    }
  }, [currentModule, editionMode, newModule]);

  useEffect(() => {
    return () => {
      dispatch(parcoursModulesSliceActions.toggleEditionMode(false));
      dispatch(parcoursModulesSliceActions.setCurrentModule(null));
      dispatch(parcoursModulesSliceActions.toggleNewModule(false));
    };
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-y-8">
      <section>
        <h1 className="text-3xl font-extrabold">Modules</h1>
      </section>
      <section>
        {isLoading ? (
          <Loader />
        ) : (
          <Wrapper>
            <DragNDropArea
              formationModules={formationModules}
              onDeleteModule={handleDeleteModule}
            />
          </Wrapper>
        )}
      </section>
      <section>
        <div className="w-full flex justify-between">
          <button
            className="btn btn-outline btn-primary"
            onClick={handleCreateModule}
            disabled={editionMode}
          >
            Créer un module
          </button>
          <button
            className="btn btn-primary"
            disabled={isLoading || updatedModules.length === 0}
            type="button"
            onClick={handleSubmitModules}
          >
            Valider les modules
          </button>
        </div>
      </section>

      {(currentModule && editionMode) || newModule ? (
        <Wrapper>
          <ModuleForm
            onSubmitModule={newModule ? handleSubmitModule : handleUpdateModule}
            isLoading={isLoading}
            ref={formRef}
          />
        </Wrapper>
      ) : null}
    </div>
  );
};

export default ModulesSection;
