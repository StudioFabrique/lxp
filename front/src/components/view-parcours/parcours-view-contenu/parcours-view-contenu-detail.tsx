import { useSelector } from "react-redux";
import Module from "../../../utils/interfaces/module";
import SubWrapper from "../../UI/sub-wrapper/sub-wrapper.component";

const ParcoursViewContenuDetail = () => {
  const modules = useSelector(
    (state: any) => state.parcoursModules.modules
  ) as Module[];

  const contentsList =
    modules.length > 0 ? (
      modules.map((module, i) => (
        <div className="flex flex-col items-center bg-primary-focus p-4 rounded-lg hover:bg-secondary-focus w-full">
          <p className="self-start">{`Cours ${i + 1}`}</p>
          <div className="flex justify-between w-full">
            <p className="self-start">{module.title}</p>
          </div>
        </div>
      ))
    ) : (
      <p>Aucun modules</p>
    );

  return (
    <SubWrapper>
      <h2 className="text-xl font-bold text-primary">Contenu du module</h2>
      <div className="flex flex-col gap-y-5">{contentsList}</div>
    </SubWrapper>
  );
};

export default ParcoursViewContenuDetail;
