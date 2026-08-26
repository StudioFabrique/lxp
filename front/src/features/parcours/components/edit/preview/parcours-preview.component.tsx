import toast from "react-hot-toast";

import ParcoursPreviewInfos from "./parcours-preview-infos.component";
import ParcoursPreviewModules from "./parcours-preview-modules.component";
import ParcoursPreviewStudent from "./parcours-preview-student";
import PreviewObjectives from "../../../../../../src/components/preview/preview-objectives";
import PreviewSkills from "../../../../../../src/components/preview/preview-skills";
import { useNavigate, useParams } from "react-router";
import useValidateParcours from "../../../hooks/useValidateParcours";
import { useMemo } from "react";
import { parcoursApi } from "../../../api/parcours.api";
import FloatingBottomNavigation from "../../../../../components/buttons/FloatingBottomNavigation";
import { useParcoursStudentsQuery } from "../../../hooks/useParcoursStudentsQuery";
import { useParcoursQuery } from "../../../hooks/useParcoursQuery";
import { useParcoursSkills } from "../../../hooks/useParcoursSkills";
import { useParcoursGroupsQuery } from "../../../hooks/useParcoursGroupsQuery";

interface ParcoursPreviewProps {
  onEdit: (id: number) => void;
}

const ParcoursPreview = (props: ParcoursPreviewProps) => {
  const { id } = useParams();
  const parcoursId = Number(id);
  const { data: parcours } = useParcoursQuery(parcoursId);
  const objectives = parcours?.objectives ?? [];
  const { skills } = useParcoursSkills(parcoursId);
  const { validateParcours } = useValidateParcours();
  const nav = useNavigate();
  const { data: groups = [] } = useParcoursGroupsQuery(parcoursId);
  const groupIds = useMemo(
    () => (groups?.map((group) => group._id).filter(Boolean) as string[]) ?? [],
    [groups],
  );
  const { data: students } = useParcoursStudentsQuery(groupIds);

  const handlePublishParcours = async (value: boolean) => {
    const validationsErrors = validateParcours();
    if (validationsErrors && validationsErrors.length !== 0) {
      toast.error(Object.values(validationsErrors![0]).toString());
    } else {
      try {
        const data = await parcoursApi.mutations.publishParcours(id!, value);
        if (data.success) {
          toast.success(data.message);
          nav(`/admin/parcours/view/${id}`);
        }
      } catch {
        toast.error("Erreur lors de la publication");
      }
    }
  };

  const handleNavigateToParcoursPreview = () => {
    nav(`/admin/parcours/view/${id}`);
  };

  return (
    /* En tête de l'aperçu */
    <div className="w-full flex flex-col gap-y-8">
      <section>
        <h1 className="text-3xl font-extrabold">Aperçu général</h1>
      </section>
      {/* Infos générales du parcours */}
      <section>
        <ParcoursPreviewInfos onEdit={props.onEdit} />
      </section>
      {/* Objectifs du parcours */}
      <section>
        <PreviewObjectives objectives={objectives} onEdit={props.onEdit} />
      </section>
      {/* Compétences du parcours */}
      <section>
        <PreviewSkills skills={skills} onEdit={props.onEdit} />
      </section>
      {/* Modules du parcours */}
      <section>
        <ParcoursPreviewModules onEdit={props.onEdit} />
      </section>
      {/* étudiants rattachés au parcours */}
      <section>
        {students ? (
          <ParcoursPreviewStudent
            onEdit={props.onEdit}
            students={students}
            groups={groups}
          />
        ) : null}
      </section>
      <FloatingBottomNavigation
        stickyActivationOffset={200}
        startActions={
          <button
            className="btn btn-ghost hover:underline"
            onClick={() => props.onEdit(6)}
          >
            Retour
          </button>
        }
        endActions={
          <>
            {!parcours?.isPublished && (
              <button
                className="btn btn-secondary"
                onClick={handleNavigateToParcoursPreview}
              >
                Sauvegarder comme brouillon
              </button>
            )}
            <button
              className="btn btn-primary"
              onClick={() =>
                parcours?.isPublished
                  ? handleNavigateToParcoursPreview()
                  : handlePublishParcours(true)
              }
            >
              {!parcours?.isPublished ? "Publier" : "Consulter le parcours"}
            </button>
          </>
        }
      />
    </div>
  );
};
export default ParcoursPreview;
