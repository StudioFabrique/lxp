/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useParcoursDispatch } from "../store/ParcoursContext";
import { useParcoursQuery } from "./useParcoursQuery";

const useParcoursService = (parcoursId?: number) => {
  const dispatch = useParcoursDispatch();
  const { data, isLoading, error: queryError } = useParcoursQuery(parcoursId);

  useEffect(() => {
    if (data) {
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

  const error = queryError
    ? ((queryError as { response?: { data?: { message?: string } } })?.response
        ?.data?.message ?? "Erreur inconnue")
    : "";

  return {
    isLoading,
    error,
  };
};

export default useParcoursService;
