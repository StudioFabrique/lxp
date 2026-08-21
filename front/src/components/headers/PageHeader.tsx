import { PropsWithChildren, useMemo, useState, type MouseEvent } from "react";
import { CircleHelp } from "lucide-react";
import { EVENTS, Joyride, type Step } from "react-joyride";
import { cn } from "../../utils/cn";
import SidebarRouteIcon from "./SidebarRouteIcon";
import PageTourTooltip from "./PageTourTooltip";
import {
  pageTourFloatingOptions,
  pageTourLocale,
  pageTourOptions,
} from "./page-tour-options";

interface Props {
  title: string;
  alternateBgColor?: boolean;
  successBgColor?: boolean;
  disabled?: boolean;
  description?: string;
  isSubHeader?: boolean;
  hasError?: boolean;
  classname?: string;
  onClick?: () => void;
  tourSteps?: Step[];
}

const PageHeader = (props: PropsWithChildren<Props>) => {
  const [isTourRunning, setIsTourRunning] = useState(false);
  const [tourKey, setTourKey] = useState(0);
  const steps = useMemo<Step[]>(
    () =>
      props.tourSteps?.length
        ? props.tourSteps
        : [
            {
              id: "page-overview",
              target: '[data-page-tour="header"]',
              title: props.title,
              content:
                props.description ??
                "Découvrez les principales fonctionnalités disponibles sur cette page.",
              placement: "bottom",
            },
          ],
    [props.description, props.title, props.tourSteps],
  );

  const startTour = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setTourKey((current) => current + 1);
    setIsTourRunning(true);
  };

  return (
    <div
      onClick={props.onClick}
      data-page-tour="header"
      className={cn(
        // Classes de base
        "w-full flex px-4 items-center justify-between rounded-lg select-none mb-6",
        // Padding vertical conditionnel
        props.isSubHeader ? "py-2" : "py-4",
        // Ring / Bordures conditionnelles
        props.isSubHeader && !props.disabled && "ring-1",
        props.hasError && "ring-2 ring-error",
        // Couleur de fond conditionnelle
        props.alternateBgColor
          ? "bg-base-200"
          : props.successBgColor
            ? "bg-success"
            : "bg-secondary/20",
        // États désactivé ou cliquable
        props.disabled && "opacity-15",
        props.onClick && "cursor-pointer hover:opacity-50",
      )}
    >
      <div className="flex items-center gap-3">
        {!props.isSubHeader && <SidebarRouteIcon />}
        <div>
          <h2
            className={cn(
              "flex-1",
              props.isSubHeader ? "text-lg font-bold" : "text-xl font-extrabold",
              props.classname,
            )}
          >
            {props.title}
          </h2>
          <p
            className={cn(
              props.isSubHeader ? "text-[8.5pt]" : "text-xs",
              props.hasError ? "text-error" : "text-base-content",
            )}
          >
            {props.description}
          </p>
        </div>
      </div>
      <div
        className="flex items-center justify-end gap-2"
        data-page-tour="header-actions"
      >
        {props.children}
        <button
          type="button"
          className="btn btn-circle btn-ghost btn-sm tooltip tooltip-left text-primary"
          onClick={startTour}
          data-tip="Découvrir cette page"
          aria-label={`Lancer le tutoriel : ${props.title}`}
        >
          <CircleHelp className="h-5 w-5" />
        </button>
      </div>

      <Joyride
        key={tourKey}
        run={isTourRunning}
        steps={steps}
        continuous
        scrollToFirstStep
        tooltipComponent={PageTourTooltip}
        onEvent={({ type }) => {
          if (type === EVENTS.TOUR_END) setIsTourRunning(false);
        }}
        floatingOptions={pageTourFloatingOptions}
        options={pageTourOptions}
        locale={pageTourLocale}
      />
    </div>
  );
};

export default PageHeader;
