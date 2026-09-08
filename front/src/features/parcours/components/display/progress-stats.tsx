import Module from "../../../../../src/utils/interfaces/module";
import BoxWrapper from "../../../../../src/components/wrappers/BoxWrapper";
import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router";
import { ChevronDown, ChevronUp } from "lucide-react";

type ProgressModulesStatsProps = {
  modules: Module[];
};

const COLLAPSED_MODULE_COUNT = 4;
const EXPANDED_MODULE_COUNT = 12;

const getModuleProgress = (module: Module) => module.stats?.progress ?? 0;

const ProgressModulesStats = ({ modules }: ProgressModulesStatsProps) => {
  const { pathname } = useLocation();
  const space = pathname.split("/")[1];
  const [showAllModules, setShowAllModules] = useState(false);
  const modulesToTrack = useMemo(() => {
    const modulesInProgress = modules
      .filter((module) => {
        const progress = getModuleProgress(module);
        return progress > 0 && progress < 100;
      })
      .sort((a, b) => getModuleProgress(b) - getModuleProgress(a));

    if (modulesInProgress.length >= COLLAPSED_MODULE_COUNT) {
      return modulesInProgress;
    }

    const unstartedModules = modules.filter(
      (module) => getModuleProgress(module) <= 0,
    );
    const completedModules = modules.filter(
      (module) => getModuleProgress(module) >= 100,
    );

    return [...modulesInProgress, ...unstartedModules, ...completedModules];
  }, [modules]);
  const displayedModules = modulesToTrack.slice(
    0,
    showAllModules ? EXPANDED_MODULE_COUNT : COLLAPSED_MODULE_COUNT,
  );
  const expandableModuleCount =
    Math.min(modulesToTrack.length, EXPANDED_MODULE_COUNT) -
    COLLAPSED_MODULE_COUNT;

  return (
    <BoxWrapper>
      <div className="flex flex-col gap-5 justify-between">
        <h2 className="text-2xl font-bold text-primary">
          Votre avancement dans le parcours
        </h2>
        <div className="flex gap-10 items-center">
          <div className="grid grid-cols-4 gap-5 w-full">
            {displayedModules.map((module) => {
              const moduleProgress = getModuleProgress(module);

              return (
                <Link
                  to={`/${space}/parcours/module/${module.id}`}
                  aria-label={`Accéder au module ${module.title}`}
                  className="tooltip tooltip-bottom flex w-full flex-col justify-between gap-4 rounded-lg border border-base-300 bg-base-200 p-4 shadow-sm transition-colors hover:bg-base-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  data-tip={module.title}
                  key={module.id}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-base-content text-sm font-semibold truncate w-3/4 text-left">
                      {module.title}
                    </p>
                    <p className="text-2xl text-primary font-bold">{`${moduleProgress}%`}</p>
                  </div>

                  <progress
                    className="progress progress-primary w-full"
                    value={moduleProgress}
                    max="100"
                  />
                </Link>
              );
            })}
          </div>
        </div>
        {expandableModuleCount > 0 ? (
          <button
            type="button"
            className="btn btn-sm btn-ghost text-primary self-center"
            onClick={() => setShowAllModules((current) => !current)}
            aria-expanded={showAllModules}
          >
            {showAllModules ? (
              <>
                <ChevronUp className="size-4" aria-hidden="true" />
                Afficher moins
              </>
            ) : (
              <>
                <ChevronDown className="size-4" aria-hidden="true" />
                Afficher plus ({expandableModuleCount})
              </>
            )}
          </button>
        ) : null}
      </div>
    </BoxWrapper>
  );
};

export default ProgressModulesStats;
