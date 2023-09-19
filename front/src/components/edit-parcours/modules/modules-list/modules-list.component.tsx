import { FC, useCallback, useEffect } from "react";
import ModulesItem from "./modules-item/modules-item.component";
import { useSelector } from "react-redux";
import Module from "../../../../utils/interfaces/module";
import useHttp from "../../../../hooks/use-http";
import { useDispatch } from "react-redux";
import { parcoursModulesSliceActions } from "../../../../store/redux-toolkit/parcours/parcours-modules";
import { useParams } from "react-router-dom";

const ModulesList: FC<{}> = () => {
  const modules: Module[] = useSelector(
    (state: any) => state.parcoursModules.modules
  );

  const { id: parcoursId } = useParams();

  const { sendRequest } = useHttp();

  const dispatch = useDispatch();

  const fetchModules = useCallback(() => {
    const applyData = (data: any) => {
      console.log(data);
      dispatch(parcoursModulesSliceActions.initParcoursModules(data.modules));
    };

    sendRequest(
      {
        path: `/module/${parcoursId}`,
      },
      applyData
    );
  }, [dispatch, sendRequest, parcoursId]);

  useEffect(() => {
    fetchModules();
  }, []);

  return (
    <div className="flex flex-col gap-y-10 p-10 bg-secondary rounded-lg overflow-y-auto">
      <p className="font-bold text-2xl">Liste des modules</p>
      {modules.length > 0 ? (
        modules.map((module) => <ModulesItem key={module.id} module={module} />)
      ) : (
        <p>Aucun modules créés</p>
      )}
    </div>
  );
};

export default ModulesList;
