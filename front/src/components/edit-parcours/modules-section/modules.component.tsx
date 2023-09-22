import { useEffect, useRef, useState } from "react";
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
  const dispatch = useDispatch();
  const currentModule = useSelector(
    (state: any) => state.parcoursModules.currentModule
  ) as Module;
  //const [newModule, setNewModule] = useState(false);
  const formRef = useRef<HTMLInputElement>(null);
  const editionMode = useSelector(
    (state: any) => state.parcoursModules.editionMode
  );
  const newModule = useSelector(
    (state: any) => state.parcoursModules.newModule
  );

  useEffect(() => {
    const applyData = (data: Module[]) => {
      const modules = data.map((module) => ({
        ...module,
        id: module.id!.toString(),
      }));
      setFormationModules(modules);
    };
    sendRequest(
      {
        path: `/modules/formation/${1}`,
      },
      applyData
    );
  }, [sendRequest]);

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
      if (editionMode) {
        dispatch(parcoursModulesSliceActions.editModule(module));
      } else {
        dispatch(parcoursModulesSliceActions.addNewModule(module));
      }
      dispatch(parcoursModulesSliceActions.toggleEditionMode(false));
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
            <DragNDropArea formationModules={formationModules} />
          </Wrapper>
        )}
      </section>
      <section>
        <div className="w-full flex justify-between">
          <button
            className="btn btn-outline btn-primary"
            onClick={handleCreateModule}
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
            onSubmitModule={handleSubmitModule}
            isLoading={isLoading}
            ref={formRef}
          />
        </Wrapper>
      ) : null}
    </div>
  );
};

export default ModulesSection;