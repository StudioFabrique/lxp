/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo } from "react";

import { normalizeImageSource } from "../../../utils/images/image-source";
import { useParcoursDispatch } from "../store/ParcoursContext";
import { useParcoursQuery } from "./useParcoursQuery";

const useParcoursService = (parcoursId?: number) => {
  const dispatch = useParcoursDispatch();
  const { data, isLoading, error: queryError } = useParcoursQuery(parcoursId);

  useEffect(() => {
    if (data) {
      const parentTags = data.formation.tags.map((item: any) => item.tag);
        dispatch({ type: "SET_PARCOURS_ID", payload: data.id! });
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
            startDate: data.startDate ?? "",
            endDate: data.endDate ?? "",
          },
        });
        dispatch({ type: "SET_PARCOURS_FORMATION", payload: data.formation as unknown as Record<string, unknown> });
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
      }
  }, [data, dispatch]);

  const image = useMemo(
    () => normalizeImageSource(data?.image) ?? "",
    [data?.image],
  );
  const error = queryError
    ? ((queryError as { response?: { data?: { message?: string } } })?.response
        ?.data?.message ?? "Erreur inconnue")
    : "";

  return {
    isLoading,
    error,
    image,
    parcours: data,
  };
};

export default useParcoursService;
