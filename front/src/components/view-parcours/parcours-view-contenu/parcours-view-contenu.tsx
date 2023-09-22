import { useSelector } from "react-redux";
import Wrapper from "../../UI/wrapper/wrapper.component";
import ParcoursContenuItem from "./parcours-view-contenu-item";
import Module from "../../../utils/interfaces/module";
import ParcoursViewContenuDetail from "./parcours-view-contenu-detail/parcours-view-contenu-detail";
import ParcoursViewContenuDetailHeader from "./parcours-view-contenu-detail/parcours-view-contenu-detail-header";

const ParcoursViewContenu = () => {
  const modules = useSelector(
    (state: any) => state.parcoursModules.modules
  ) as Module[];

  const contentsList =
    modules.length > 0 ? (
      modules.map((module, i) => (
        <ParcoursContenuItem
          key={module.id}
          module={module}
          iterationCount={i + 1}
        />
      ))
    ) : (
      <p>Aucun modules</p>
    );

  return (
    <Wrapper>
      <h2 className="text-xl font-bold text-primary">Contenu du parcours</h2>
      <div className="grid lg:grid-cols-2 gap-x-10 gap-y-5">
        <div className="flex flex-col gap-y-5">{contentsList}</div>
        <div className="">
          <ParcoursViewContenuDetailHeader
            imageModuleHeader={`data:image/jpeg;base64,${
              modules[0]?.image ?? ""
            }`}
            moduleTitle="test"
          />
          <ParcoursViewContenuDetail />
        </div>
      </div>
    </Wrapper>
  );
};

export default ParcoursViewContenu;
