/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";

import useHttp from "../../../../src/hooks/useHttp";
import { useParcoursDispatch } from "../store/ParcoursContext";

const useParcoursService = () => {
  const { error, isLoading, sendRequest } = useHttp();
  const dispatch = useParcoursDispatch();
  const [image, setImage] = useState<string>("");

  const getParcours = useCallback(
    (parcoursId: number) => {
      const processData = (data: any) => {
        const parentTags = data.formation.tags.map((item: any) => item.tag);
        dispatch({ type: "SET_PARCOURS_ID", payload: data.id });
        dispatch({
          type: "UPDATE_PARCOURS_INFOS",
          payload: {
            title: data.title,
            description: data.description,
            isPublished: data.isPublished,
            visibility: data.visibility,
          },
        });
        dispatch({
          type: "UPDATE_PARCOURS_DATES",
          payload: {
            startDate: data.startDate,
            endDate: data.endDate,
          },
        });
        dispatch({ type: "SET_PARCOURS_FORMATION", payload: data.formation });
        if (data.image) {
          setImage(`data:image/jpeg;base64,${data.image}`);
        }
        if (data.tags.length > 0) {
          dispatch({
            type: "SET_CURRENT_TAGS",
            payload: data.tags.map((item: any) => item.tag),
          });
        } else {
          dispatch({ type: "SET_CURRENT_TAGS", payload: parentTags });
        }
        dispatch({ type: "SET_PARENT_TAGS", payload: parentTags });
        if (data.virtualClass) {
          dispatch({ type: "SET_VIRTUAL_CLASS", payload: data.virtualClass });
        }
        if (data.contacts.length > 0) {
          dispatch({ type: "SET_CURRENT_CONTACTS", payload: data.contacts });
        }
        if (data.skills.length > 0) {
          dispatch({
            type: "SET_SKILLS_LIST",
            payload: data.skills.map((item: any) => item.skill),
          });
        }
        if (data.bonusSkills.length > 0) {
          dispatch({ type: "SET_SKILLS_LIST", payload: data.bonusSkills });
        }
        if (data.objectives.length > 0) {
          dispatch({
            type: "ADD_IMPORTED_OBJECTIVES",
            payload: data.objectives,
          });
        }
        if (data.modules.length > 0) {
          dispatch({
            type: "SET_MODULES",
            payload: data.modules.map((item: any) => {
              return {
                ...item,
                title: item.module.title,
                quizInstructions: item.module.quizInstructions,
                thumb: item.module.thumb,
                contacts: item.contacts.map(
                  (itemContact: any) => itemContact.contact,
                ),
                bonusSkills: item.bonusSkills.map(
                  (itemBonusSkills: any) => itemBonusSkills.bonusSkill,
                ),
              };
            }),
          });
        } else {
          dispatch({ type: "SET_MODULES", payload: [] });
        }
        if (data.groups.length > 0) {
          dispatch({
            type: "SET_GROUPS_IDS",
            payload: data.groups.map((item: any) => item.group),
          });
        } else {
          dispatch({ type: "SET_GROUPS", payload: [] });
        }
      };
      sendRequest(
        {
          path: `/parcours/parcours-by-id/${parcoursId}`,
        },
        processData,
      );
    },
    [dispatch, sendRequest],
  );

  useEffect(() => {
    return () => setImage("");
  }, []);

  return {
    getParcours,
    isLoading,
    error,
    image,
  };
};

export default useParcoursService;
