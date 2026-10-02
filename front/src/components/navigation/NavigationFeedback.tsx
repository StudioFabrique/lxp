import { useEffect, useState } from "react";
import type { createBrowserRouter } from "react-router";
import { useVisualPreferences } from "../../store/VisualPreferences";
import "./navigation-feedback.css";

type NavigationRouter = Pick<ReturnType<typeof createBrowserRouter>, "state" | "subscribe">;
type Phase = "idle" | "loading" | "complete";

/** Observe the router itself so Links, imperative navigation and history share
 * the same feedback, including lazy route downloads and route loaders. Capture
 * the source before React handles the event (also works with stopPropagation).
 */
export default function NavigationFeedback({ router }: { router: NavigationRouter }) {
  const { animations } = useVisualPreferences();
  const [phase, setPhase] = useState<Phase>("idle");
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    let candidate: HTMLElement | null = null;
    let source: HTMLElement | null = null;
    let originalBusy: string | null = null;
    let originalPosition: string | null = null;
    let pending = false;
    let messageTimer: number | undefined;
    let completionTimer: number | undefined;

    const clearSource = () => {
      if (!source) return;
      source.removeAttribute("data-navigation-pending");
      source.removeAttribute("data-navigation-static");
      if (originalBusy === null) source.removeAttribute("aria-busy");
      else source.setAttribute("aria-busy", originalBusy);
      if (originalPosition === null) source.removeAttribute("data-navigation-position");
      else source.setAttribute("data-navigation-position", originalPosition);
      source = null;
    };

    const capture = (event: MouseEvent) => {
      candidate = null;
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const path = event.composedPath().filter((node): node is HTMLElement => node instanceof HTMLElement);
      if (source && path.includes(source)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      const link = path.find((node) => node instanceof HTMLAnchorElement);
      if (link instanceof HTMLAnchorElement && (
        link.hasAttribute("download") || (link.target && link.target !== "_self") ||
        new URL(link.href, window.location.href).origin !== window.location.origin
      )) return;

      candidate = path.find((node) => node.matches("a[href], button, [role='button'], [data-navigation-trigger]"))
        ?? path.find((node) => node.classList.contains("cursor-pointer")) ?? null;
      // Only attribute synchronous navigation to this gesture. A later redirect
      // or background save must not animate an unrelated previously clicked UI.
      const captured = candidate;
      queueMicrotask(() => { if (candidate === captured) candidate = null; });
    };

    const update = (state: NavigationRouter["state"]) => {
      const nextPending = state.navigation.state !== "idle";
      if (nextPending) {
        if (!pending || candidate) {
          clearSource();
          source = candidate;
          candidate = null;
          if (source) {
            originalBusy = source.getAttribute("aria-busy");
            originalPosition = source.getAttribute("data-navigation-position");
            if (getComputedStyle(source).position === "static") {
              source.setAttribute("data-navigation-position", "relative");
            }
            source.setAttribute("aria-busy", "true");
            source.setAttribute("data-navigation-pending", "true");
            if (!animations) source.setAttribute("data-navigation-static", "true");
          }
        }
        if (!pending) {
          window.clearTimeout(completionTimer);
          setPhase("loading");
          setShowMessage(false);
          messageTimer = window.setTimeout(() => setShowMessage(true), 800);
        }
      } else if (pending) {
        clearSource();
        window.clearTimeout(messageTimer);
        setShowMessage(false);
        setPhase("complete");
        completionTimer = window.setTimeout(() => setPhase("idle"), 180);
      }
      pending = nextPending;
    };

    document.addEventListener("click", capture, true);
    document.addEventListener("dblclick", capture, true);
    const unsubscribe = router.subscribe(update);
    update(router.state);
    return () => {
      unsubscribe();
      document.removeEventListener("click", capture, true);
      document.removeEventListener("dblclick", capture, true);
      window.clearTimeout(messageTimer);
      window.clearTimeout(completionTimer);
      clearSource();
    };
  }, [router, animations]);

  return (
    <>
      <div className="navigation-progress" data-phase={phase} data-animated={animations} aria-hidden="true">
        <div className="navigation-progress-bar" />
      </div>
      <div role="status" aria-live="polite" aria-atomic="true" className={showMessage ? "navigation-status" : "sr-only"}>
        {showMessage ? "Chargement de la page…" : ""}
      </div>
    </>
  );
}
