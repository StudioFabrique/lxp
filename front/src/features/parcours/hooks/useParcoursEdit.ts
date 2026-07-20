import { stepsParcours } from "../../../config/steps/steps-parcours";
import { testModules } from "../helpers/parcours-steps-validation";
import useSteps from "../../../hooks/useSteps";
import useParcoursService from "../hooks/useParcoursServices";
import { parcoursApi } from "../api/parcours.api";
import { useCallback, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router";
import {
  useParcoursSelector,
  useParcoursDispatch,
} from "../store/ParcoursContext";

export function useParcoursEdit() {
  const initialStateRef = useRef(true);

  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useParcoursDispatch();
  const { actualStep, finalStep, stepsList, updateStep, validateStep } =
    useSteps(stepsParcours);
  const infos = useParcoursSelector(
    (state) => state.parcoursInformations.infos,
  );
  const formation = useParcoursSelector((state) => state.parcours.formation);
  const { image, getParcours, isLoading, error } = useParcoursService();
  const modules = useParcoursSelector((state) => state.parcoursModules.modules);
  const checkStep = useRef(true);

  const step = searchParams.get("step");

  useEffect(() => {
    if (id !== undefined && initialStateRef.current) {
      getParcours(+id);
      initialStateRef.current = false;
    }
  }, [id, getParcours]);

  useEffect(() => {
    if (step && checkStep.current) {
      updateStep(+step);
      checkStep.current = false;
    }
  }, [step, updateStep]);

  useEffect(() => {
    return () => {
      initialStateRef.current = true;
      dispatch({ type: "RESET_PARCOURS" });
      dispatch({ type: "RESET_PARCOURS_INFORMATIONS" });
      dispatch({ type: "RESET_TAGS" });
      dispatch({ type: "RESET_CONTACTS" });
      dispatch({ type: "RESET_SKILLS" });
      dispatch({ type: "RESET_OBJECTIVES" });
      dispatch({ type: "RESET_MODULES" });
      dispatch({ type: "RESET_GROUPS" });
    };
  }, [dispatch]);

  const updateImage = useCallback(
    (image: File) => {
      const formData = new FormData();
      formData.append("parcoursId", id!);
      formData.append("image", image);
      parcoursApi.mutations.updateParcoursImage(id!, formData);
    },
    [id],
  );

  const handleUpdateStep = (id: number) => {
    validateStep(id, true);
  };

  const handleRetour = () => {
    if (actualStep.id === 6 && (!modules || !testModules(modules))) {
      updateStep(4);
    } else updateStep(actualStep.id - 1);
  };

  const handleResetImportedSkills = () => {
    dispatch({ type: "IMPORT_SKILLS", payload: [] });
  };

  const handleResetImportedObjectives = () => {
    dispatch({ type: "IMPORT_OBJECTIVES", payload: [] });
  };

  return {
    id,
    actualStep,
    finalStep,
    stepsList,
    updateStep,
    validateStep,
    updateImage,
    isLoading,
    error,
    infos,
    formation,
    image,
    handleUpdateStep,
    handleRetour,
    handleResetImportedSkills,
    handleResetImportedObjectives,
  };
}
