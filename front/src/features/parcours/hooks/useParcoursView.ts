/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import {
  useParcoursSelector,
  useParcoursDispatch,
} from "../store/ParcoursContext";
import { parcoursApi } from "../api/parcours.api";

export default function useParcoursView() {
  const { id } = useParams();
  const dispatch = useParcoursDispatch();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitial, setIsInitial] = useState(true);
  const [image, setImage] = useState<string>();
  const [studentCount, setStudentCount] = useState<number>();

  const parcours = useParcoursSelector((state) => state.parcours);
  const parcoursInfos = useParcoursSelector(
    (state) => state.parcoursInformations.infos,
  );
  const modules = useParcoursSelector(
    (state) => state.parcoursModules.modules,
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchParcours = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await parcoursApi.queries.getById(+id!);
        setStudentCount((data as any).studentCount);
        dispatch({ type: "SET_PARCOURS_ID", payload: data.id! });
        dispatch({
          type: "UPDATE_PARCOURS_INFOS",
          payload: {
            title: data.title,
            description: data.description,
          },
        });
        dispatch({
          type: "UPDATE_PARCOURS_DATES",
          payload: {
            startDate: data.startDate ?? "",
            endDate: data.endDate ?? "",
          },
        });
        dispatch({ type: "SET_PARCOURS_FORMATION", payload: data.formation as any });

        if (data.image) {
          setImage(`data:image/jpeg;base64,${data.image}`);
        }
        if (data.tags.length > 0) {
          dispatch({
            type: "SET_CURRENT_TAGS",
            payload: data.tags.map((item: any) => item.tag),
          });
        } else {
          dispatch({
            type: "SET_CURRENT_TAGS",
            payload: data.formation.tags.map((item: any) => item.tag),
          });
        }

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
            payload: data.modules.map((module: any) => {
              return {
                ...module,
                title: module.module.title,
                description: module.module.description,
                thumb: module.module.thumb,
                stats: module.stats,
              };
            }),
          });
        }
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ?? "Erreur inconnue";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    if (isInitial) {
      fetchParcours();
      setIsInitial(false);
    }
  }, [id, dispatch, isInitial]);

  useEffect(() => {
    return () => {
      setIsInitial(true);
      dispatch({ type: "RESET_PARCOURS" });
      dispatch({ type: "RESET_PARCOURS_INFORMATIONS" });
      dispatch({ type: "RESET_TAGS" });
      dispatch({ type: "RESET_CONTACTS" });
      dispatch({ type: "RESET_SKILLS" });
      dispatch({ type: "RESET_OBJECTIVES" });
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
