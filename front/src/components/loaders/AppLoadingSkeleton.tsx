import { readIntroFirstRunHint } from "../../features/intro-presentation/intro-first-run-hint";
import { cn } from "../../utils/cn";
import { isDashboardLanding } from "../../features/intro-presentation/intro-presentation-status";

/** Full-page placeholder used while authentication and route modules resolve. */
export default function AppLoadingSkeleton() {
  // Sur le dashboard, la barre dépend du compte : réduite à la première présentation,
  // complète ensuite. Tant qu'on l'ignore, on ne dessine ni l'une ni l'autre plutôt
  // que de montrer la mauvaise.
  const introHint = isDashboardLanding(window.location.pathname)
    ? readIntroFirstRunHint()
    : false;
  const isIntroFirstRun = introHint === true;
  const isSidebarUnknown = introHint === null;

  return (
    <div role="status" aria-label="Chargement de l’application" className="relative flex h-dvh gap-2 bg-base-100 p-2">
      <span className="sr-only">Chargement de l’application…</span>
      {isSidebarUnknown ? null : isIntroFirstRun ? (
        <div
          aria-hidden="true"
          className="absolute left-2 top-2 z-10 flex h-16 w-[min(32rem,calc(100vw-1rem))] items-center justify-between gap-5 rounded-xl border border-(--sidebar-border) bg-(--sidebar-bg) px-3"
        >
          <div className="skeleton h-[31px] w-24 rounded opacity-60" />
          <div className="skeleton h-12 max-w-80 flex-1 rounded-lg opacity-60" />
          <div className="skeleton size-8 rounded-lg opacity-60" />
        </div>
      ) : (
      <aside className="flex w-16 shrink-0 flex-col justify-between rounded-xl border border-(--sidebar-border) bg-(--sidebar-bg) p-4 2xl:w-80" aria-hidden="true">
        <div>
          <div className="skeleton mb-5 size-8 rounded-full opacity-60 2xl:size-12.5" />
          <div className="space-y-1">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="flex h-8 w-8 items-center justify-center gap-3 2xl:w-full 2xl:justify-start 2xl:px-2">
                <div className="skeleton size-4 shrink-0 rounded opacity-60" />
                <div className="skeleton hidden h-3 w-1/2 opacity-60 2xl:block" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-1">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="flex h-8 w-8 items-center justify-center gap-3 2xl:w-full 2xl:justify-start 2xl:px-2">
              <div className="skeleton size-4 shrink-0 rounded opacity-60" />
              <div className="skeleton hidden h-3 w-1/2 opacity-60 2xl:block" />
            </div>
          ))}
        </div>
      </aside>
      )}
      {/* La présentation remplace le contenu de la page : un voile et un spinner, pas de squelette de page. */}
      {isIntroFirstRun ? (
        <div className="absolute inset-0 grid place-items-center bg-(--sidebar-bg)/15" aria-hidden="true">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : null}
      <main className={cn("min-w-0 flex-1 overflow-hidden", isIntroFirstRun && "invisible")} aria-hidden="true">
        <div className="mx-auto mt-[8vh] mb-[4vh] w-[90%] space-y-6 xl:w-[80%]">
          <div className="flex min-h-20 items-center gap-3 rounded-lg border border-base-300 bg-base-200 px-4">
            <div className="skeleton size-7 rounded-lg" />
            <div className="space-y-2"><div className="skeleton h-5 w-40" /><div className="skeleton h-3 w-52 max-w-[45vw]" /></div>
          </div>
          <div className="flex min-h-80 flex-col justify-between gap-5 rounded-lg border border-base-300 bg-base-200 p-5">
            <div className="skeleton h-10 w-full rounded-lg" />
            <div className="skeleton h-5 w-2/3 rounded-lg" />
            <div className="skeleton h-12 w-full rounded-lg" />
          </div>
        </div>
      </main>
    </div>
  );
}
