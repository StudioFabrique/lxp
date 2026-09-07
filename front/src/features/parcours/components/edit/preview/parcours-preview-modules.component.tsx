import { useContext } from "react";
import { Pencil } from "lucide-react";
import { Link, useParams } from "react-router";

import Wrapper from "../../../../../../src/components/wrappers/BoxWrapper";
import EditIcon from "../../../../../../src/components/UI/svg/edit-icon";
import { useParcoursModules } from "../../../hooks/useParcoursModules";
import { AuthContext } from "../../../../../store/AuthProvider";
import { getModulesLabel } from "../../../../../utils/helpers/user-role";
import ModuleCard from "../modules/ModuleCard";

interface ParcoursPreviewModulesProps {
  onEdit: (id: number) => void;
}

const ParcoursPreviewModules = (props: ParcoursPreviewModulesProps) => {
  const { id } = useParams();
  const { modules } = useParcoursModules(Number(id));
  const { user } = useContext(AuthContext);

  return (
    <Wrapper>
      <span className="w-full flex justify-between items-center">
        <h2 className="text-xl font-bold">
          {getModulesLabel(user, "Liste des modules")}
        </h2>
        <div
          className="w-6 h-6 text-primary cursor-pointer"
          onClick={() => props.onEdit(4)}
        >
          <EditIcon />
        </div>
      </span>
      <section className="grid items-start gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) =>
          module.id == null ? null : (
            <ModuleCard
              key={module.id}
              module={{
                id: module.id,
                title: module.title,
                description: module.description,
                quizInstructions: module.quizInstructions,
                duration: module.duration,
                thumb: module.thumb ?? null,
                contacts: module.contacts,
                skills: module.bonusSkills,
              }}
              headerAction={
                <Link
                  to={`?step=4&moduleId=${module.id}`}
                  onClick={() => props.onEdit(4)}
                  className="btn btn-square btn-sm border-white/60 bg-base-100/90 text-base-content shadow-sm tooltip tooltip-left hover:bg-base-100"
                  data-tip="Modifier le module"
                  aria-label={`Modifier le module ${module.title}`}
                >
                  <Pencil className="size-[1.2em]" />
                </Link>
              }
            />
          ),
        )}
      </section>
    </Wrapper>
  );
};

export default ParcoursPreviewModules;
