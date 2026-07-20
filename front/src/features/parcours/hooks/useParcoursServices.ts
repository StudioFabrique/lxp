import { useCallback, useEffect, useState } from "react";

import { normalizeImageSource } from "../../../utils/images/image-source";
import { parcoursApi } from "../api/parcours.api";
import { useParcoursDispatch } from "../store/ParcoursContext";

const useParcoursService = () => {
  const dispatch = useParcoursDispatch();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<string>("");

  const getParcours = useCallback(
    async (parcoursId: number) => {
      setIsLoading(true);
      setError("");
      try {
        const data = await parcoursApi.queries.getById(parcoursId);
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
        if (data.image) {
          setImage(normalizeImageSource(data.image) ?? "");
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
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ?? "Erreur inconnue";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch],
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
