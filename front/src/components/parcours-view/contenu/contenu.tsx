/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import Wrapper from "../../UI/wrapper/wrapper.component";
import ParcoursContenuItem from "./contenu-item";
import Module from "../../../utils/interfaces/module";
import ContenuDetail from "./contenu-detail/contenu-detail";
import ContenuDetailHeader from "./contenu-detail/contenu-detail-header";
import { useState } from "react";
import Can from "../../UI/can/can.component";
import { Link, useParams } from "react-router-dom";
import EditIcon from "../../UI/svg/edit-icon";

const Contenu = () => {
  const modules = useSelector(
    (state: any) => state.parcoursModules.modules
  ) as Module[];

  const { id: parcoursId } = useParams();

  const [selectedModule, setSelectedModule] = useState<Module | null>(
    modules ? modules[0] : null
  );

  const contentsList =
    modules?.length > 0 ? (
      modules.map((module, i) => (
        <ParcoursContenuItem
          key={module.id}
          module={module}
          selectedModuleId={selectedModule?.id}
          iterationCount={i + 1}
          setSelectedModule={setSelectedModule}
        />
      ))
    ) : (
      <p>Aucun modules</p>
    );

  return (
    <Wrapper>
      <div className="flex flex-col gap-y-10">
        <span className="flex justify-between">
          <h2 className="text-xl font-bold text-primary">
            Contenu du parcours
          </h2>
          <Can action="update" object="parcours">
            <Link
              to={`/admin/parcours/edit/${parcoursId}`}
              className="btn btn-primary "
            >
              <span className="h-5 w-5">
                <EditIcon />
              </span>
              <p className="normal-case">Modifier</p>
            </Link>
          </Can>
        </span>
        <div className="grid lg:grid-cols-2 gap-x-10 gap-y-5">
          <div className="flex flex-col gap-y-5">{contentsList}</div>
          {modules?.length > 0 && (
            <div className="flex flex-col gap-y-4">
              <ContenuDetailHeader imageModuleHeader={selectedModule?.thumb} />
              <ContenuDetail moduleId={selectedModule?.id ?? 0} />
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default Contenu;
