/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useHttp from "../../../hooks/use-http";
import { useEffect, useState } from "react";
import Module from "../../../utils/interfaces/module";
import Parcours from "../../../utils/interfaces/parcours";
import { parcoursAction } from "../../../store/redux-toolkit/parcours/parcours";
import { parcoursInformationsAction } from "../../../store/redux-toolkit/parcours/parcours-informations";
import { tagsAction } from "../../../store/redux-toolkit/tags";
import { parcoursContactsAction } from "../../../store/redux-toolkit/parcours/parcours-contacts";
import { parcoursSkillsAction } from "../../../store/redux-toolkit/parcours/parcours-skills";
import { parcoursObjectivesAction } from "../../../store/redux-toolkit/parcours/parcours-objectives";
import { parcoursModulesSliceActions } from "../../../store/redux-toolkit/parcours/parcours-modules";

export default function useParcoursView() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { sendRequest, error } = useHttp();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitial, setIsInitial] = useState(true);
  const [image, setImage] = useState<string>();
  const [studentCount, setStudentCount] = useState<number>();

  const parcours = useSelector((state: any) => state.parcours);
  const parcoursInfos = useSelector(
    (state: any) => state.parcoursInformations.infos
  );
  const modules = useSelector(
    (state: { parcoursModules: { modules: Module[] } }) =>
      state.parcoursModules.modules
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const processData = (data: Parcours & { studentCount?: number }) => {
      setStudentCount(data.studentCount);
      dispatch(parcoursAction.setParcoursId(data.id));
      dispatch(
        parcoursInformationsAction.updateParcoursInfos({
          title: data.title,
          description: data.description,
        })
      );
      dispatch(
        parcoursInformationsAction.updateParcoursDates({
          startDate: data.startDate,
          endDate: data.endDate,
        })
      );
      dispatch(parcoursAction.setParcoursFormation(data.formation));

      if (data.image) {
        setImage(`data:image/jpeg;base64,${data.image}`);
      }
      if (data.tags.length > 0) {
        dispatch(
          tagsAction.setCurrentTags(data.tags.map((item: any) => item.tag))
        );
      } else {
        dispatch(
          tagsAction.setCurrentTags(
            data.formation.tags.map((item: any) => item.tag)
          )
        );
      }

      if (data.virtualClass) {
        dispatch(parcoursInformationsAction.setVirtualClass(data.virtualClass));
      }

      if (data.contacts.length > 0) {
        dispatch(
          parcoursContactsAction.setCurrentContacts(
            data.contacts.map((item: any) => item.contact)
          )
        );
      }
      if (data.skills.length > 0) {
        dispatch(
          parcoursSkillsAction.setSkillsList(
            data.skills.map((item: any) => item.skill)
          )
        );
      }

      if (data.bonusSkills.length > 0) {
        dispatch(parcoursSkillsAction.setSkillsList(data.bonusSkills));
      }

      if (data.objectives.length > 0) {
        dispatch(
          parcoursObjectivesAction.addImportedObjectivesToObjectives(
            data.objectives
          )
        );
      }

      if (data.modules.length > 0) {
        dispatch(
          parcoursModulesSliceActions.setModules(
            data.modules
              .map((module: any) => module.module)
              ?.sort(
                (a, b) =>
                  new Date(a.minDate || 0).getTime() -
                  new Date(b.minDate || 0).getTime()
              )
          )
        );
      }

      setIsLoading(false);
    };

    if (isInitial) {
      setIsLoading(true);
      sendRequest(
        {
          path: `/parcours/parcours-by-id/${id}`,
        },
        processData
      );
      setIsInitial(false);
    }
  }, [id, dispatch, sendRequest, isInitial]);

  useEffect(() => {
    return () => {
      setIsInitial(true);
      dispatch(parcoursAction.reset());
      dispatch(parcoursInformationsAction.reset());
      dispatch(tagsAction.reset());
      dispatch(parcoursContactsAction.reset());
      dispatch(parcoursSkillsAction.reset());
      dispatch(parcoursObjectivesAction.reset());
    };
  }, [dispatch]);

  return {
    isLoading,
    error,
    image,
    parcours,
    parcoursInfos,
    modules,
    studentCount,
  };
}
