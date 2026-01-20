import { useState } from "react";
import Parcours from "../../../utils/interfaces/parcours";
import { useLocation } from "react-router-dom";

enum ImportStep {
  JsonImport,
}

export default function useImportModules() {
  const { state }: { state: { parcoursId: number } } = useLocation();

  const [importStep, setImportStep] = useState<ImportStep>();
  const [parcoursData, setParcoursData] = useState<Parcours[]>();
  const [selectedParcours, setSelectedParcours] = useState<Parcours>();

  return {
    importStep,
    selectedParcours,
  };
}
