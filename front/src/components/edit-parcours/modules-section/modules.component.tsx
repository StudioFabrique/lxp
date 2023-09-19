import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import useHttp from "../../../hooks/use-http";
import Wrapper from "../../UI/wrapper/wrapper.component";
import DragNDropArea from "./drag-n-drop-area";
import Module from "../../../utils/interfaces/module";
import ModuleForm from "./module-form.component";
import { useDispatch } from "react-redux";
import { setModules } from "../../../store/redux-toolkit/parcours/parcours-modules";

const ModulesSection = () => {
  const { isLoading, sendRequest } = useHttp();
  const [formationModules, setFormationModules] = useState<any>([]);
  const params = useParams();
  const parcoursId = params.id;
  const updatedModules = useSelector(
    (state: any) => state.parcoursModule.modules
  );
  const dispatch = useDispatch();
  const currentModule = useSelector(
    (state: any) => state.parcoursModule.currentModule
  ) as Module;
  const [newModule, setNewModule] = useState(false);
  const formRef = useRef<HTMLInputElement>(null);
  const editionMode = useSelector(
    (state: any) => state.parcoursModule.editionMode
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
    const applyData = (data: any) => {
      dispatch(setModules(data));
    };
    sendRequest(
      {
        path: `/modules/${parcoursId}`,
        method: "put",
        body: updatedModules.map((item: string) => +item),
      },
      applyData
    );
  };

  const handleCreateModule = () => {
    setNewModule(true);
  };

  const handleSubmitNewModule = (file: File) => {};
  console.log({ editionMode });

  useEffect(() => {
    if (currentModule && formRef) {
      formRef.current!.scrollIntoView({ behavior: "smooth" });
      formRef.current!.focus();
    }
  }, [currentModule]);

  return (
    <div className="flex flex-col gap-y-8">
      <section>
        <h1 className="text-3xl font-extrabold">Modules</h1>
      </section>
      <section></section>
      <Wrapper>
        <DragNDropArea
          formationModules={formationModules}
          newModule={newModule}
        />
      </Wrapper>
      <div className="w-full flex justify-between">
        <button
          className="btn btn-outline btn-primary"
          onClick={handleCreateModule}
        >
          Créer un module
        </button>
        {isLoading ? (
          <button className="btn btn-primary" type="button">
            <span className="loading loading-spinner"></span>
            Validation en cours
          </button>
        ) : (
          <button
            className="btn btn-primary"
            disabled={isLoading || updatedModules.length === 0}
            type="button"
            onClick={handleSubmitModules}
          >
            Valider les modules
          </button>
        )}
      </div>
      {currentModule && editionMode ? (
        <Wrapper>
          <ModuleForm onSubmitNewModule={handleSubmitNewModule} ref={formRef} />
        </Wrapper>
      ) : null}
    </div>
  );
};

export default ModulesSection;
