import { useSelector } from "react-redux";
import Wrapper from "../../UI/wrapper/wrapper.component";
import ParcoursContenuItem from "./parcours-view-contenu-item";
import Module from "../../../utils/interfaces/module";
import ParcoursViewContenuDetail from "./parcours-view-contenu-detail/parcours-view-contenu-detail";
import ParcoursViewContenuDetailHeader from "./parcours-view-contenu-detail/parcours-view-contenu-detail-header";
import { useState } from "react";

const ParcoursViewContenu = () => {
  const modules = useSelector(
    (state: any) => state.parcoursModules.modules
  ) as Module[];

  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  const contentsList =
    modules?.length > 0 ? (
      modules.map((module, i) => (
        <ParcoursContenuItem
          key={module.id}
          module={module}
          iterationCount={i + 1}
          setSelectedModule={setSelectedModule}
        />
      ))
    ) : (
      <p>Aucun modules</p>
    );

  return (
    <Wrapper>
      <h2 className="text-xl font-bold text-secondary">Contenu du parcours</h2>
      <div className="grid lg:grid-cols-2 gap-x-10 gap-y-5">
        <div className="flex flex-col gap-y-5">{contentsList}</div>
        {modules?.length > 0 && (
          <div className="flex flex-col gap-y-4">
            <ParcoursViewContenuDetailHeader
              imageModuleHeader={`https://images.frandroid.com/wp-content/uploads/2017/10/udemy_header-630x310.png`}
              moduleTitle={selectedModule?.title}
            />
            <ParcoursViewContenuDetail />
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default ParcoursViewContenu;
