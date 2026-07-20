import { stepsParcours } from "../../../config/steps/steps-parcours";
import { testModules } from "../helpers/parcours-steps-validation";
import useSteps from "../../../hooks/useSteps";
import useParcoursService from "../hooks/useParcoursServices";
import { parcoursApi } from "../api/parcours.api";
import { normalizeImageSource } from "../../../utils/images/image-source";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router";
import {
  useParcoursSelector,
  useParcoursDispatch,
} from "../store/ParcoursContext";
import Step from "../../../utils/interfaces/step";
import { useParcoursQuery } from "./useParcoursQuery";
import type Objective from "../../../utils/interfaces/objective";

type ImportedSkill = Record<string, unknown> & { description: string };

export function useParcoursEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useParcoursDispatch();
  const { actualStep, finalStep, stepsList, updateStep, validateStep } =
    useSteps(stepsParcours as Step[]);
  const parcoursId = id !== undefined ? +id : undefined;
  const { data: parcours, isLoading, error: queryError } =
    useParcoursQuery(parcoursId);
  useParcoursService(parcoursId);
  const infos = parcours;
  const formation = parcours?.formation;
  const image = normalizeImageSource(parcours?.image) ?? "";
  const error = queryError
    ? ((queryError as { response?: { data?: { message?: string } } })?.response
        ?.data?.message ?? "Erreur inconnue")
    : "";
  const modules = useParcoursSelector((state) => state.parcoursModules.modules);
  const checkStep = useRef(true);
  const [importedSkills, setImportedSkills] = useState<ImportedSkill[]>([]);
  const [importedObjectives, setImportedObjectives] = useState<Objective[]>([]);

  const step = searchParams.get("step");

  useEffect(() => {
    if (step && checkStep.current) {
      updateStep(+step);
      checkStep.current = false;
    }
  }, [step, updateStep]);

  useEffect(() => {
    return () => {
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
    if (actualStep.id === 1) navigate("/admin/parcours");
    if (actualStep.id === 6 && (!modules || !testModules(modules))) {
      updateStep(4);
    } else updateStep(actualStep.id - 1);
  };

  const handleResetImportedSkills = () => {
    setImportedSkills([]);
  };

  const handleResetImportedObjectives = () => {
    setImportedObjectives([]);
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
    importedSkills,
    importedObjectives,
    setImportedSkills,
    setImportedObjectives,
  };
}
