import { EVENTS, Joyride, type Step } from "react-joyride";
import { useSearchParams } from "react-router";
import PageTourTooltip from "../headers/PageTourTooltip";
import {
  pageTourFloatingOptions,
  pageTourLocale,
  pageTourOptions,
} from "../headers/page-tour-options";

type Props = {
  tutorial: string;
  steps: Step[];
};

/**
 * Visite guidée démarrée depuis une action recommandée du dashboard.
 *
 * Le paramètre reste dans l'URL pendant la visite afin que Joyride puisse
 * attendre les éléments chargés de façon asynchrone. Il est retiré dès que
 * l'utilisateur termine ou quitte le tutoriel.
 */
export default function RecommendedActionTour({ tutorial, steps }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const isRunning = searchParams.get("tutorial") === tutorial;

  if (!isRunning) return null;

  const closeTour = () => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete("tutorial");
    setSearchParams(nextSearchParams, { replace: true });
  };

  return (
    <Joyride
      run
      steps={steps}
      continuous
      scrollToFirstStep
      tooltipComponent={PageTourTooltip}
      onEvent={({ type }) => {
        if (type === EVENTS.TOUR_END) closeTour();
      }}
      floatingOptions={pageTourFloatingOptions}
      options={pageTourOptions}
      locale={pageTourLocale}
    />
  );
}
