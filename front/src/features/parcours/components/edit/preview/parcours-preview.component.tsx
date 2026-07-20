/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParcoursSelector, useParcoursDispatch } from "../../../store/ParcoursContext";
import toast from "react-hot-toast";

import ParcoursPreviewInfos from "./parcours-preview-infos.component";
import ParcoursPreviewModules from "./parcours-preview-modules.component";
import ParcoursPreviewStudent from "./parcours-preview-student";
import Objective from "../../../../../../src/utils/interfaces/objective";
import PreviewObjectives from "../../../../../../src/components/preview/preview-objectives";
import Skill from "../../../../../../src/utils/interfaces/skill";
import PreviewSkills from "../../../../../../src/components/preview/preview-skills";
import { useNavigate, useParams } from "react-router";
import useValidateParcours from "../../../hooks/useValidateParcours";
import { useCallback, useEffect, useState } from "react";
import User from "../../../../../../src/utils/interfaces/user";
import Group from "../../../../../../src/utils/interfaces/group";
import { parcoursApi } from "../../../api/parcours.api";
import FloatingBottomNavigation from "../../../../../components/buttons/FloatingBottomNavigation";


interface ParcoursPreviewProps {
  onEdit: (id: number) => void;
}

const ParcoursPreview = (props: ParcoursPreviewProps) => {
  const { id } = useParams();
  const objectives = useParcoursSelector(
    (state) => state.parcoursObjectives.objectives,
  ) as Objective[];
  const skills = useParcoursSelector(
    (state) => state.parcoursSkills.skills,
  ) as Skill[];
  const { validateParcours } = useValidateParcours();
  const nav = useNavigate();
  const groups = useParcoursSelector(
    (state) => state.parcoursGroups.groups,
  ) as Group[];
  const [students, setStudents] = useState<User[] | null>(null);
  const dispatch = useParcoursDispatch();

  const handlePublishParcours = async (value: boolean) => {
    const validationsErrors = validateParcours();
    if (validationsErrors && validationsErrors.length !== 0) {
      toast.error(Object.values(validationsErrors![0]).toString());
    } else {
      dispatch({ type: "PUBLISH_PARCOURS", payload: value });
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

  const getStudents = useCallback(async () => {
    try {
      const data = await parcoursApi.queries.getStudentsByGroupIds(
        groups.map((item) => item._id).filter(Boolean) as string[]
      );
      let updatedStudents = Array<User>();
      (data as any[]).forEach((item: any) => {
        const updatedItem = item.users.map((user: any) => ({
          ...user,
          group: { _id: item._id, name: item.name },
        }));
        updatedStudents = [...updatedStudents, ...updatedItem];
      });
      setStudents(updatedStudents);
    } catch {
      toast.error("Erreur lors du chargement des étudiants");
    }
  }, [groups]);

  useEffect(() => {
    if (groups) {
      getStudents();
    }
  }, [groups, getStudents]);

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
          <ParcoursPreviewStudent onEdit={props.onEdit} students={students} />
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
            <button
              className="btn btn-secondary"
              onClick={() => handlePublishParcours(false)}
            >
              Sauvegarder comme brouillon
            </button>
            <button
              className="btn btn-primary"
              onClick={() => handlePublishParcours(true)}
            >
              Publier
            </button>
          </>
        }
      />
    </div>
  );
};
export default ParcoursPreview;
