import { useCallback, useState } from "react";
import { useLocation } from "react-router-dom";
import Module from "../../../utils/interfaces/module";
import Course from "../../../utils/interfaces/course";
import Lesson from "../../../utils/interfaces/lesson";
import { Activity } from "../../../utils/interfaces/activity";

export enum ModulesImportStep {
  ZipImport,
  ImportResult,
}

// Module type altered to be compatible with the current context
// Adding value to Activity type
type ModuleImportType = Module & {
  courses: (Course & {
    lessons: (Lesson & { activities: (Activity & { value: string })[] })[];
  })[];
};

export default function useImportModules() {
  const { state }: { state: { parcoursId: number } } = useLocation();

  const [step, setImportStep] = useState<ModulesImportStep>(
    ModulesImportStep.ZipImport,
  );

  // Modules with his courses, lessons and associated activities
  const [importedModules, setImportedModules] = useState<ModuleImportType[]>();

  // const [formationsList, setFormationsList] = useState<Formation[]>();
  // const [selectedFormation, setSelectedFormation] = useState<Formation>();
  // const [parcoursList, setParcoursList] = useState<Parcours[]>();
  // const [selectedParcours, setSelectedParcours] = useState<Parcours>();

  /**
   * Import the zip file, scan for activities alongside the json file
   * and automatically store them by modules, courses and lessons.
   */
  const onImportZip = (file: File) => {
    console.log("file imported");

    // validation code (zod)
    // ...
    // import code
    // ...
  };

  /**
   * Confirm the import structure after displaying it
   */
  const onConfirmImport = () => {
    setImportStep(ModulesImportStep.ImportResult);
  };

  // --- Data Fetching from api ---
  // const retreiveFormations = useCallback(() => {}, []);

  // const retreiveParcours = useCallback(() => {}, []);

  return {
    step,
    importedModules,
    onImportZip,
    onConfirmImport,
  };
}
