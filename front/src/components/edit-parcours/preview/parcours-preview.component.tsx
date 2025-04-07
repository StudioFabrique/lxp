/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import ParcoursPreviewInfos from "./parcours-preview-infos.component";
import ParcoursPreviewModules from "./parcours-preview-modules.component";
import ParcoursPreviewStudent from "./parcours-preview-student";
import Objective from "../../../utils/interfaces/objective";
import PreviewObjectives from "../../preview/preview-objectives";
import Skill from "../../../utils/interfaces/skill";
import PreviewSkills from "../../preview/preview-skills";
import { useNavigate, useParams } from "react-router-dom";
import useValidateParcours from "../../../views/parcours/parcours-edit/hooks/use-validate-parcours";
import useHttp from "../../../hooks/use-http";
import { useCallback, useEffect, useState } from "react";
import User from "../../../utils/interfaces/user";
import Group from "../../../utils/interfaces/group";
import { useDispatch } from "react-redux";
import { parcoursInformationsAction } from "../../../store/redux-toolkit/parcours/parcours-informations";

interface ParcoursPreviewProps {
  onEdit: (id: number) => void;
}

const ParcoursPreview = (props: ParcoursPreviewProps) => {
  const { id } = useParams();
  const objectives = useSelector(
    (state: any) => state.parcoursObjectives.objectives,
  ) as Objective[];
  const skills = useSelector(
    (state: any) => state.parcoursSkills.skills,
  ) as Skill[];
  const { validateParcours } = useValidateParcours();
  const nav = useNavigate();
  const { sendRequest } = useHttp();
  const groups = useSelector(
    (state: any) => state.parcoursGroups.groups,
  ) as Group[];
  const [students, setStudents] = useState<User[] | null>(null);
  const dispatch = useDispatch();

  const handlePublishParcours = (value: boolean) => {
    const validationsErrors = validateParcours();
    if (validationsErrors && validationsErrors.length !== 0) {
      toast.error(Object.values(validationsErrors![0]).toString());
    } else {
      dispatch(parcoursInformationsAction.publish(value));
      const applyData = (data: { success: boolean; message: string }) => {
        if (data.success) {
          toast.success(data.message);
          nav(`/admin/parcours/view/${id}`);
        }
      };
      sendRequest(
        {
          path: `/parcours/publish/${id}`,
          method: "put",
          body: { isPublished: value },
        },
        applyData,
      );
    }
  };

  const getStudents = useCallback(() => {
    const applyData = (data: any) => {
      let updatedStudents = Array<User>();
      data.forEach((item: any) => {
        const updatedItem = item.users.map((user: any) => ({
          ...user,
          group: { _id: item._id, name: item.name },
        }));
        updatedStudents = [...updatedStudents, ...updatedItem];
      });
      setStudents(updatedStudents);
    };

    sendRequest(
      {
        path: `/user/group`,
        method: "post",
        body: groups.map((item) => item._id),
      },
      applyData,
    );
  }, [groups, sendRequest]);

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
      <section className="w-full flex justify-between">
        <button
          className="btn btn-primary btn-outline"
          onClick={() => props.onEdit(6)}
        >
          Retour
        </button>
        <span className="flex gap-x-4 items-center">
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
        </span>
      </section>
    </div>
  );
};
export default ParcoursPreview;
