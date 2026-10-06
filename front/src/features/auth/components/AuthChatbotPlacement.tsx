import { useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { chooseChatbotPlacement } from "./auth-chatbot-placement";
import { AuthChatbotTransitionContext } from "./AuthChatbotTransitionContext";
import { motion, useDragControls, useMotionValue, useReducedMotion } from "motion/react";
import { AuthChatbotDragContext } from "./AuthChatbotDragContext";

const desktopQuery = "(min-width: 1024px)";
const isDesktop = (): boolean => window.matchMedia?.(desktopQuery).matches ?? false;
const subscribeViewport = (listener: () => void): (() => void) => {
  if (!window.matchMedia) return () => undefined;
  const media = window.matchMedia(desktopQuery);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
};

type Props = { children: ReactNode; floating?: boolean; scopeRef?: RefObject<HTMLDivElement | null>; stepId?: string };

export default function AuthChatbotPlacement({ children, floating = true, scopeRef, stepId }: Props) {
  const desktop = useSyncExternalStore(subscribeViewport, isDesktop, () => false);
  const previousPosition = useContext(AuthChatbotTransitionContext);
  const reducedMotion = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [random] = useState(() => Math.random());
  const [turnDuringMove] = useState(() => Math.random() < 0.35);
  const usePortal = floating;
  const placed = useRef(false);
  const [dragBounds, setDragBounds] = useState({ left: 0, right: 0, top: 0, bottom: 0 });
  const dragged = useRef(false);
  const dragControls = useDragControls();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const dragContext = useMemo(() => ({
    start: (event: React.PointerEvent<HTMLButtonElement>): void => {
      if (event.button !== 0) return;
      dragged.current = false;
      hostRef.current?.getAnimations?.().forEach(animation => animation.cancel());
      const rect = hostRef.current?.getBoundingClientRect();
      if (rect) setDragBounds({
        left: x.get() + 20 - rect.left,
        right: x.get() + window.innerWidth - 20 - rect.right,
        top: y.get() + 20 - rect.top,
        bottom: y.get() + window.innerHeight - 20 - rect.bottom,
      });
      window.requestAnimationFrame(() => dragControls.start(event));
    },
    wasDragged: (): boolean => {
      const result = dragged.current;
      dragged.current = false;
      return result;
    },
  }), [dragControls, x, y]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !usePortal || !window.ResizeObserver) return;
    const observer = new ResizeObserver(() => {
      if (!placed.current) return;
      const rect = host.getBoundingClientRect();
      if (rect.bottom > window.innerHeight - 20) y.set(y.get() - (rect.bottom - window.innerHeight + 20));
    });
    observer.observe(host);
    return () => observer.disconnect();
  }, [usePortal, y]);

  useEffect(() => {
    if (!usePortal) return;
    const place = (): void => {
      const host = hostRef.current;
      const anchor = scopeRef?.current ?? anchorRef.current;
      if (!host || !anchor) return;
      const scope = (anchor.closest("[data-onboarding-panel]") ?? anchor.closest("section"))?.getBoundingClientRect();
      if (!scope) return;
      const obstacles = Array.from(document.querySelectorAll<HTMLElement>(
        'input, textarea, select, button, a, label, h1, h2, h3, [role="img"], [role="button"], [data-auth-caption]',
      )).filter(element => !host.contains(element) && !element.closest('[inert], [aria-hidden="true"]'))
        .map(element => element.getBoundingClientRect())
        .filter(rect => rect.width > 0 && rect.height > 0);
      const point = desktop ? chooseChatbotPlacement(
        { width: window.innerWidth, height: window.innerHeight },
        { width: host.offsetWidth, height: host.offsetHeight },
        obstacles,
        random,
        { left: Math.min(scope.right + 16, window.innerWidth - host.offsetWidth - 40), top: 0, width: host.offsetWidth + 40, height: window.innerHeight },
        undefined,
        previousPosition?.getPosition(),
      ) : null;
      // Narrow screens put the dialogue below the card, outside its scroll area.
      const target = point ?? (desktop ? {
        left: Math.min(scope.right + 24, window.innerWidth - host.offsetWidth - 20),
        top: Math.max(20, Math.min(scope.top, window.innerHeight - host.offsetHeight - 20)),
      } : {
        left: Math.max(20, scope.left + (scope.width - host.offsetWidth) / 2),
        top: scope.bottom + window.scrollY + 24,
      });
      const previous = previousPosition?.getPosition();
      host.getAnimations?.().forEach(animation => animation.cancel());
      if (!desktop) host.querySelector<HTMLElement>('[aria-label="Chatbot ANDRIA"]')?.getAnimations?.().forEach(animation => animation.cancel());
      x.set(0);
      y.set(0);
      host.style.position = desktop ? "fixed" : "absolute";
      host.style.left = `${target.left}px`;
      host.style.top = `${target.top}px`;
      host.style.visibility = "visible";
      const viewportTop = desktop ? target.top : target.top - window.scrollY;
      setDragBounds({
        left: 20 - target.left,
        right: window.innerWidth - target.left - host.offsetWidth - 20,
        top: 20 - viewportTop,
        bottom: window.innerHeight - viewportTop - host.offsetHeight - 20,
      });
      if (desktop && previous && !reducedMotion) {
        host.animate?.([
          { transform: `translate(${previous.left - target.left}px, ${previous.top - target.top}px)` },
          { transform: "translate(0px, 0px)" },
        ], { duration: 700, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
        if (turnDuringMove) {
          host.querySelector<HTMLElement>('[aria-label="Chatbot ANDRIA"]')?.animate?.([
            { transform: "rotate(0deg)" },
            { transform: "rotate(360deg)" },
          ], { duration: 800, easing: "cubic-bezier(0.45, 0, 0.2, 1)" });
        }
      }
      previousPosition?.setPosition(target);
      placed.current = true;
    };
    // Measure the settled column, rather than positions mid-way through its intro.
    const timer = window.setTimeout(place, previousPosition?.getPosition() ? 350 : 1300);
    window.addEventListener("resize", place);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", place);
    };
  }, [desktop, previousPosition, random, reducedMotion, turnDuringMove, usePortal, scopeRef, stepId, x, y]);

  if (!usePortal) return <div data-chatbot-placement="inline">{children}</div>;
  return <>
    <div ref={anchorRef} aria-hidden="true" />
    {createPortal(
    <AuthChatbotDragContext value={dragContext}>
    <motion.div ref={hostRef} data-chatbot-placement="page" className="fixed z-40 w-[420px] max-w-[calc(100vw-2.5rem)]" style={{ x, y, visibility: "hidden" }}
      drag dragControls={dragControls} dragListener={false} dragConstraints={dragBounds} dragElastic={0} dragMomentum={false}
      onDragStart={() => { dragged.current = true; }}
      onDragEnd={() => {
        const rect = hostRef.current?.getBoundingClientRect();
        if (rect) previousPosition?.setPosition({ left: rect.left, top: rect.top });
      }}>
      {children}
    </motion.div>
    </AuthChatbotDragContext>,
    document.body,
    )}
  </>;
}
