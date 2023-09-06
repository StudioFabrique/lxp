import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import useHttp from "../../../hooks/use-http";
import Wrapper from "../../UI/wrapper/wrapper.component";
import DragNDropArea from "./drag-n-drop-area";
import Module from "../../../utils/interfaces/module";
import ModuleForm from "./module-form.component";

const ModulesSection = () => {
  const { isLoading, sendRequest } = useHttp();
  const [formationModules, setFormationModule] = useState<any>([]);
  const params = useParams();
  const parcoursId = params.id;
  const updatedModules = useSelector(
    (state: any) => state.parcoursModule.cloneModules
  );

  useEffect(() => {
    const applyData = (data: Module[]) => {
      const modules = data.map((module) => ({
        ...module,
        id: module.id!.toString(),
      }));
      setFormationModule(modules);
    };
    sendRequest(
      {
        path: `/module/formation/${1}`,
      },
      applyData
    );
  }, [sendRequest]);

  // mise à jour de la liste des modules du parcours dans la bdd et mise à jour du state en cas de réussite
  const handleSubmitModules = () => {
    const applyData = (data: any) => {
      console.log({ data });
    };
    sendRequest(
      {
        path: `/module/${parcoursId}`,
        method: "put",
        body: updatedModules.map((item: string) => +item),
      },
      applyData
    );
  };

  return (
    <div className="flex flex-col gap-y-8">
      <section>
        <h1 className="text-3xl font-extrabold">Modules</h1>
      </section>
      <section></section>
      <Wrapper>
        <DragNDropArea formationModules={formationModules} />
      </Wrapper>
      <div className="w-full flex justify-end">
        {isLoading ? (
          <button className="btn btn-primary" type="button">
            <span className="loading loading-spinner"></span>
            Validation en cours
          </button>
        ) : (
          <button
            className="btn btn-primary"
            disabled={isLoading}
            type="button"
            onClick={handleSubmitModules}
          >
            Valider les modules
          </button>
        )}
      </div>
      <Wrapper>
        <ModuleForm />
      </Wrapper>
    </div>
  );
};

export default ModulesSection;
