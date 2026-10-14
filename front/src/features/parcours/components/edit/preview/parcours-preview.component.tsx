import { Save, Send } from "lucide-react";
import toast from "react-hot-toast";

import ParcoursPreviewInfos from "./parcours-preview-infos.component";
import ParcoursPreviewModules from "./parcours-preview-modules.component";
import ParcoursPreviewStudent from "./parcours-preview-student";
import PreviewObjectives from "../../../../../../src/components/preview/preview-objectives";
import PreviewSkills from "../../../../../../src/components/preview/preview-skills";
import { useNavigate, useParams } from "react-router";
import useValidateParcours from "../../../hooks/useValidateParcours";
import { useContext, useMemo, useState } from "react";
import { showParcoursValidationToast } from "../../../helpers/show-parcours-validation-toast";
import PublishParcoursModal from "./PublishParcoursModal";
import { parcoursApi } from "../../../api/parcours.api";
import FloatingBottomNavigation from "../../../../../components/buttons/FloatingBottomNavigation";
import { useParcoursStudentsQuery } from "../../../hooks/useParcoursStudentsQuery";
import { useParcoursQuery } from "../../../hooks/useParcoursQuery";
import { useParcoursSkills } from "../../../hooks/useParcoursSkills";
import { useParcoursGroupsQuery } from "../../../hooks/useParcoursGroupsQuery";
import { AuthContext } from "../../../../../store/AuthProvider";
import { isTeacherUser } from "../../../../../utils/helpers/user-role";

interface ParcoursPreviewProps {
  onEdit: (id: number) => void;
}

const ParcoursPreview = (props: ParcoursPreviewProps) => {
  const { user } = useContext(AuthContext);
  const isTeacher = isTeacherUser(user);
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

  const [isPublishModalOpen, setPublishModalOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Les erreurs de validation sont signalées avant de demander confirmation.
  const handleRequestPublish = () => {
    const validationsErrors = validateParcours();
    if (validationsErrors && validationsErrors.length !== 0) {
      showParcoursValidationToast(validationsErrors, props.onEdit);
      return;
    }
    setPublishModalOpen(true);
  };

  const handlePublishParcours = async (value: boolean) => {
    const validationsErrors = validateParcours();
    if (validationsErrors && validationsErrors.length !== 0) {
      showParcoursValidationToast(validationsErrors, props.onEdit);
      setPublishModalOpen(false);
    } else {
      setIsPublishing(true);
      try {
        const data = await parcoursApi.mutations.publishParcours(id!, value);
        if (data.success) {
          toast.success(data.message);
          nav(`/admin/parcours/view/${id}`);
        }
      } catch {
        toast.error("Erreur lors de la publication");
      } finally {
        setIsPublishing(false);
        setPublishModalOpen(false);
      }
    }
  };

  const handleNavigateToParcoursPreview = () => {
    nav(`/admin/parcours/view/${id}`);
  };

  return (
    <div className="w-full flex flex-col gap-y-8">
      {/* Infos générales du parcours */}
      <section>
        <ParcoursPreviewInfos onEdit={props.onEdit} groups={groups} isTeacher={isTeacher} />
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
            {(parcours?.isPublished || !isTeacher) && (
              <button
                className="btn btn-primary"
                onClick={() =>
                  parcours?.isPublished
                    ? handleNavigateToParcoursPreview()
                    : handleRequestPublish()
                }
              >
                {!parcours?.isPublished ? (
                  <>
                    <Send className="size-4" aria-hidden="true" />
                    Publier
                  </>
                ) : (
                  "Consulter le parcours"
                )}
              </button>
            )}
            {!parcours?.isPublished && (
              <button
                className="btn btn-secondary"
                onClick={handleNavigateToParcoursPreview}
              >
                <Save className="size-4" aria-hidden="true" />
                Sauvegarder comme brouillon
              </button>
            )}
          </>
        }
      />
      {isPublishModalOpen ? (
        <PublishParcoursModal
          isSubmitting={isPublishing}
          onConfirm={() => void handlePublishParcours(true)}
          onCancel={() => setPublishModalOpen(false)}
        />
      ) : null}
    </div>
  );
};
export default ParcoursPreview;
