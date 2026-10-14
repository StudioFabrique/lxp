import { stepsParcours } from "../../../config/steps/steps-parcours";
import useSteps from "../../../hooks/useSteps";
import { parcoursApi } from "../api/parcours.api";
import { normalizeImageSource } from "../../../utils/images/image-source";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router";
import Step from "../../../utils/interfaces/step";
import { useParcoursQuery } from "./useParcoursQuery";
import type Objective from "../../../utils/interfaces/objective";

type ImportedSkill = Record<string, unknown> & { description: string };

export function useParcoursEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const step = searchParams.get("step");
  // L'étape de l'URL initialise l'état : un rechargement reste sur la même étape.
  const initialStepId = step !== null && step !== "" ? Number(step) : undefined;
  const { actualStep, stepsList, updateStep, validateStep } = useSteps(
    stepsParcours as Step[],
    initialStepId,
  );
  const [moduleFormOpened, setModuleFormOpened] = useState(false);
  const parcoursId = id !== undefined ? +id : undefined;
  const {
    data: parcours,
    isLoading,
    error: queryError,
  } = useParcoursQuery(parcoursId);
  const infos = parcours;
  const formation = parcours?.formation;
  const image = normalizeImageSource(parcours?.image) ?? "";
  const error = queryError
    ? ((queryError as { response?: { data?: { message?: string } } })?.response
        ?.data?.message ?? "Erreur inconnue")
    : "";
  const appliedStepRef = useRef<string | null>(null);
  const mirroredStepIdRef = useRef(actualStep.id);
  const [importedSkills, setImportedSkills] = useState<ImportedSkill[]>([]);
  const [importedObjectives, setImportedObjectives] = useState<Objective[]>([]);

  useEffect(() => {
    if (!step) {
      appliedStepRef.current = null;
      return;
    }

    if (appliedStepRef.current === step) return;
    appliedStepRef.current = step;
    updateStep(+step);
    setModuleFormOpened(false);
  }, [step, updateStep]);

  // Reflète l'étape courante dans l'URL pour la retrouver après un rechargement.
  // Le garde sur `mirroredStepIdRef` évite de réécrire l'URL quand c'est elle
  // qui vient de changer (lien interne) avant que l'état ne l'ait rattrapée.
  useEffect(() => {
    if (mirroredStepIdRef.current === actualStep.id) return;
    mirroredStepIdRef.current = actualStep.id;
    if (step === String(actualStep.id)) return;

    setSearchParams(
      (currentParams) => {
        const nextParams = new URLSearchParams(currentParams);
        nextParams.set("step", String(actualStep.id));
        return nextParams;
      },
      { replace: true },
    );
  }, [actualStep.id, step, setSearchParams]);

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
    if (actualStep.id === 1) {
      navigate("/admin/parcours");
      return;
    }
    updateStep(actualStep.id - 1);
  };

  const handleResetImportedSkills = () => {
    setImportedSkills([]);
  };

  const handleResetImportedObjectives = () => {
    setImportedObjectives([]);
  };

  return {
    id,
    moduleFormOpened,
    setModuleFormOpened,
    actualStep,
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
