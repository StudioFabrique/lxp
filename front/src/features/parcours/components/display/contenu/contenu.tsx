import Wrapper from "../../../../../../src.legacy/components/UI/wrapper/wrapper.component";
import ContenuItem from "./contenu-item";
import Module from "../../../../../../src/utils/interfaces/module";
import ContenuDetail from "./contenu-detail/contenu-detail";
import ContenuDetailHeader from "./contenu-detail/contenu-detail-header";
import { useContext, useState } from "react";
import { Link, useParams } from "react-router";
import EditIcon from "../../../../../../src.legacy/components/UI/svg/edit-icon";
import userBelongsToContacts from "../../../../../utils/helpers/user-belongs-to-contacts";
import { AuthContext } from "../../../../../store/AuthProvider";
import { useParcoursSelector } from "../../../store/ParcoursContext";
import PermissionGuard from "../../../../../components/guards/PermissionGuard";

type ContenuProps = {
  modules: Module[];
};

const Contenu = ({ modules }: ContenuProps) => {
  const { user } = useContext(AuthContext);
  const contacts = useParcoursSelector(
    (state) => state.parcoursContacts.currentContacts,
  );

  const { id: parcoursId } = useParams();

  const [selectedModule, setSelectedModule] = useState<Module | null>(
    modules ? modules[0] : null,
  );

  const canEditParcoursContent = userBelongsToContacts(user, contacts);
  const canEditModule = userBelongsToContacts(user, selectedModule?.contacts);

  return (
    <Wrapper>
      <div className="flex flex-col gap-y-6">
        <span className="flex justify-between">
          <h2 className="text-2xl font-bold text-primary">
            Contenu du parcours
          </h2>
          {canEditParcoursContent && (
            <div className="flex gap-5">
              <PermissionGuard action="update" object="parcours">
                <Link
                  to={`/admin/parcours/edit/${parcoursId}?step=${4}`}
                  className="btn btn-primary text-base-100"
                >
                  <span className="h-5 w-5">
                    <EditIcon />
                  </span>
                  Modifier
                </Link>
              </PermissionGuard>
            </div>
          )}
        </span>
        <div
          data-testid="contenu-section"
          className="grid lg:grid-cols-2 gap-x-10 gap-y-5"
        >
          <div className="flex flex-col gap-y-2">
            {modules?.length > 0 ? (
              modules.map((module, i) => (
                <ContenuItem
                  key={module.id}
                  module={module}
                  selectedModuleId={selectedModule?.id}
                  iterationCount={i + 1}
                  setSelectedModule={setSelectedModule}
                />
              ))
            ) : (
              <p>Aucun modules</p>
            )}
          </div>
          {modules?.length > 0 && (
            <div className="flex flex-col gap-y-4">
              <ContenuDetailHeader
                imageModuleHeader={selectedModule?.thumb}
                title={selectedModule?.title}
              />
              <ContenuDetail
                canEdit={canEditModule}
                parcoursId={Number(parcoursId)}
                moduleId={selectedModule?.id ?? 0}
              />
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default Contenu;
