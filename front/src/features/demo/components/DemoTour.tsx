import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { EVENTS, Joyride, type EventData, type Step } from "react-joyride";
import toast from "react-hot-toast";

import PageTourTooltip from "../../../components/headers/PageTourTooltip";
import {
  pageTourFloatingOptions,
  pageTourLocale,
  pageTourOptions,
} from "../../../components/headers/page-tour-options";
import { useDemoMode } from "../../../store/DemoContext";
import { demoTourSteps } from "../demo-tour-steps";
import {
  clearDemoTour,
  readDemoTourLayout,
  type DemoTourLayout,
} from "../demo-tour-storage";
import { subscribeToDemoTourEvents } from "../demo-tour-events";

type Props = { layout: DemoTourLayout };

/**
 * Visite guidée de la démonstration.
 *
 * Un composant distinct d'`OnboardingTour`, dont l'essentiel de la mécanique
 * (attente d'action, prérequis de formulaire, verrouillage du défilement,
 * reprise persistée) sert à piloter une création de contenu — sans objet dans
 * une démonstration en consultation seule. On réutilise en revanche l'habillage
 * des tours par page, pour que l'apparence reste la même partout.
 *
 * La navigation entre pages passe par le hook `before` de chaque étape : la
 * visite attend que la promesse se résolve avant d'afficher la bulle, et
 * Joyride patiente ensuite que la cible apparaisse.
 */
const DemoTour = ({ layout }: Props) => {
  const { demoMode } = useDemoMode();
  const navigate = useNavigate();
  const [runKey, setRunKey] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const steps = useMemo<Step[]>(
    () =>
      demoTourSteps[layout].map(({ route, ...step }) => ({
        ...step,
        before: async () => {
          if (!route) return;
          navigate(route);
          // Laisse le routeur monter la page avant que Joyride ne cherche la
          // cible ; au-delà, `targetWaitTimeout` prend le relais.
          await new Promise((resolve) => setTimeout(resolve, 120));
        },
      })),
    [layout, navigate],
  );

  const start = useCallback(() => {
    setRunKey((current) => current + 1);
    setIsRunning(true);
  }, []);

  // Armé à l'entrée dans la démonstration, jamais côté serveur : le compte est
  // partagé par tous les visiteurs simultanés, un état enregistré sur le compte
  // priverait les suivants du tutoriel.
  useEffect(() => {
    if (!demoMode) return;
    if (readDemoTourLayout() === layout) {
      clearDemoTour();
      start();
    }
  }, [demoMode, layout, start]);

  useEffect(() => subscribeToDemoTourEvents(start), [start]);

  const handleEvent = useCallback(({ type }: EventData) => {
    if (type !== EVENTS.TOUR_END) return;
    setIsRunning(false);
    toast.success("Visite terminée : explorez librement.");
  }, []);

  if (!demoMode || !isRunning) return null;

  return (
    <Joyride
      key={runKey}
      run
      continuous
      steps={steps}
      scrollToFirstStep
      tooltipComponent={PageTourTooltip}
      onEvent={handleEvent}
      floatingOptions={pageTourFloatingOptions}
      options={{ ...pageTourOptions, targetWaitTimeout: 8_000 }}
      locale={pageTourLocale}
    />
  );
};

export default DemoTour;
