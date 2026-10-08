import {
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { chooseChatbotPlacement } from "./auth-chatbot-placement";
import { AuthChatbotTransitionContext } from "./AuthChatbotTransitionContext";
import {
  motion,
  useDragControls,
  useMotionValue,
  useIsPresent,
  useReducedMotion,
} from "motion/react";
import { AuthChatbotDragContext } from "./AuthChatbotDragContext";
import {
  chatbotAppearDurationMs,
  chatbotAppearEasing,
  chatbotAppearScale,
  chatbotMoveDurationMs,
  chatbotMoveEasing,
} from "./auth-chatbot-motion";
import { chatbotAvatarSelector, chatbotDesktopQuery, hideIntroChatbots } from "./auth-chatbot-handoff";

const isDesktop = (): boolean =>
  window.matchMedia?.(chatbotDesktopQuery).matches ?? false;
const subscribeViewport = (listener: () => void): (() => void) => {
  if (!window.matchMedia) return () => undefined;
  const media = window.matchMedia(chatbotDesktopQuery);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
};

const contentTags = new Set([
  "svg",
  "img",
  "video",
  "canvas",
  "input",
  "textarea",
  "select",
  "button",
]);

/** Viewport position of an HTML element from its layout offsets, ignoring transforms. */
const layoutOrigin = (element: HTMLElement): { left: number; top: number } => {
  let left = -window.scrollX;
  let top = -window.scrollY;
  for (let node: HTMLElement | null = element; node; node = node.offsetParent as HTMLElement | null) {
    left += node.offsetLeft;
    top += node.offsetTop;
    // Content scrolled inside a positioned ancestor (a scroll container) is shifted by its scroll offset.
    const parent = node.offsetParent;
    if (parent instanceof HTMLElement && parent !== document.body) {
      left -= parent.scrollLeft;
      top -= parent.scrollTop;
    }
    if (getComputedStyle(node).position === "fixed") {
      left += window.scrollX;
      top += window.scrollY;
      break;
    }
  }
  return { left, top };
};

/**
 * Rectangle of an element once running transforms settle. The welcome step is
 * placed while its column still slides and its content still fades in, so the
 * current rectangles would describe a layout the user never sees at rest.
 */
const settledRect = (element: Element): DOMRect => {
  const rect = element.getBoundingClientRect();
  const html = element instanceof HTMLElement ? element : element.parentElement?.closest<HTMLElement>("*");
  if (!html) return rect;
  const current = html.getBoundingClientRect();
  const settled = layoutOrigin(html);
  return new DOMRect(rect.left + settled.left - current.left, rect.top + settled.top - current.top, rect.width, rect.height);
};

/** Whether the user can see the element: collapsed content keeps its layout box but is hidden or clipped to nothing. */
const isVisible = (element: Element): boolean => {
  if (getComputedStyle(element).visibility === "hidden") return false;
  for (let node = element.parentElement; node && node !== document.body; node = node.parentElement) {
    const style = getComputedStyle(node);
    if (style.overflow !== "visible" && node.getBoundingClientRect().height < 1) return false;
  }
  return true;
};

/** Visible content of the step, including decorative icons, so the dialogue only fills its empty space. */
const contentObstacles = (scope: Element, host: HTMLElement): DOMRect[] =>
  Array.from(scope.querySelectorAll<Element>("*"))
    .filter(
      (element) =>
        !host.contains(element) &&
        !element.closest("[inert]") &&
        isVisible(element) &&
        !element.parentElement?.closest("svg") &&
        (contentTags.has(element.tagName.toLowerCase()) ||
          Array.from(element.childNodes).some(
            (node) =>
              node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
          )),
    )
    .map(settledRect)
    .filter((rect) => rect.width > 0 && rect.height > 0);

type Props = {
  children: ReactNode;
  floating?: boolean;
  scopeRef?: RefObject<HTMLDivElement | null>;
  stepId?: string;
};

export default function AuthChatbotPlacement({
  children,
  floating = true,
  scopeRef,
  stepId,
}: Props) {
  const desktop = useSyncExternalStore(
    subscribeViewport,
    isDesktop,
    () => false,
  );
  const previousPosition = useContext(AuthChatbotTransitionContext);
  const reducedMotion = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const inlineRef = useRef<HTMLDivElement>(null);
  const present = useIsPresent();
  // Scale of the avatar inherited from the introduction, undone while moving to the first location.
  const handoffScale = useRef<number | null>(null);
  const [random] = useState(() => Math.random());
  const usePortal = floating;
  const placed = useRef(false);
  const [dragBounds, setDragBounds] = useState({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  });
  const dragged = useRef(false);
  const [dragging, setDragging] = useState(false);
  const dragControls = useDragControls();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const dragContext = useMemo(
    () => ({
      start: (event: React.PointerEvent<HTMLButtonElement>): void => {
        if (event.button !== 0) return;
        dragged.current = false;
        hostRef.current
          ?.getAnimations?.()
          .forEach((animation) => animation.cancel());
        const rect = hostRef.current?.getBoundingClientRect();
        if (rect)
          setDragBounds({
            left: x.get() + 20 - rect.left,
            right: x.get() + window.innerWidth - 20 - rect.right,
            top: y.get() + 20 - rect.top,
            bottom: y.get() + window.innerHeight - 20 - rect.bottom,
          });
        window.requestAnimationFrame(() => dragControls.start(event));
      },
      dragging,
      wasDragged: (): boolean => {
        const result = dragged.current;
        dragged.current = false;
        return result;
      },
    }),
    [dragControls, dragging, x, y],
  );

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !usePortal || !window.ResizeObserver) return;
    const observer = new ResizeObserver(() => {
      // Only the fixed desktop dialogue follows the viewport; on narrow screens it scrolls with the page.
      if (!placed.current || host.style.position !== "fixed") return;
      const rect = host.getBoundingClientRect();
      if (rect.bottom > window.innerHeight - 20)
        y.set(y.get() - (rect.bottom - window.innerHeight + 20));
    });
    observer.observe(host);
    return () => observer.disconnect();
  }, [usePortal, y]);

  // Track the introduction while it is shown: once it exits, the page has already
  // switched to the step layout and its position no longer matches what was seen.
  // A layout effect stops tracking in the commit that starts the exit.
  useLayoutEffect(() => {
    if (usePortal || !present || !desktop || !previousPosition) return;
    let frame = 0;
    const track = (): void => {
      const rect = inlineRef.current?.querySelector(chatbotAvatarSelector)?.getBoundingClientRect();
      if (rect && rect.width > 0) previousPosition.setIntroAvatar({ left: rect.left, top: rect.top, width: rect.width, height: rect.height });
      frame = window.requestAnimationFrame(track);
    };
    track();
    return () => window.cancelAnimationFrame(frame);
  }, [desktop, present, previousPosition, usePortal]);

  // Show the dialogue at its previous location until it moves to the new one. Taking
  // over from the introduction, its avatar covers the introduction avatar exactly.
  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!usePortal || !desktop || !host || !previousPosition || placed.current) return;
    const intro = previousPosition.getIntroAvatar();
    const avatar = host.querySelector<HTMLElement>(chatbotAvatarSelector);
    if (intro && avatar) {
      const hostRect = host.getBoundingClientRect();
      const own = avatar.getBoundingClientRect();
      previousPosition.setPosition({
        left: intro.left + intro.width / 2 - (own.left - hostRect.left + own.width / 2),
        top: intro.top + intro.height / 2 - (own.top - hostRect.top + own.height / 2),
      });
      previousPosition.setIntroAvatar(null);
      if (own.width > 0) {
        handoffScale.current = intro.width / own.width;
        avatar.style.transform = `scale(${handoffScale.current})`;
      }
    }
    const start = previousPosition.getPosition();
    if (!start) return;
    host.style.position = "fixed";
    host.style.left = `${start.left}px`;
    host.style.top = `${start.top}px`;
    host.style.visibility = "visible";
    hideIntroChatbots();
  }, [desktop, previousPosition, usePortal]);

  useEffect(() => {
    if (!usePortal) return;
    const place = (): void => {
      const host = hostRef.current;
      const anchor = scopeRef?.current ?? anchorRef.current;
      if (!host || !anchor) return;
      const scopeElement =
        anchor.closest("[data-onboarding-panel]") ?? anchor.closest("section");
      if (!scopeElement) return;
      const scope = settledRect(scopeElement);
      const obstacles = Array.from(
        document.querySelectorAll<HTMLElement>(
          'input, textarea, select, button, a, label, h1, h2, h3, [role="img"], [role="button"], [data-auth-caption]',
        ),
      )
        .filter(
          (element) =>
            !host.contains(element) &&
            !element.closest('[inert], [aria-hidden="true"]') &&
            isVisible(element),
        )
        .map(settledRect)
        .filter((rect) => rect.width > 0 && rect.height > 0);
      const viewport = { width: window.innerWidth, height: window.innerHeight };
      const size = { width: host.offsetWidth, height: host.offsetHeight };
      // Prefer the empty part of the step itself, then the gutter beside it.
      const visibleScope = {
        left: scope.left,
        top: Math.max(0, scope.top),
        width: scope.width,
        height:
          Math.min(scope.bottom, window.innerHeight) - Math.max(0, scope.top),
      };
      const columnElement = scopeElement.closest("[data-auth-column]");
      const column = columnElement ? settledRect(columnElement) : null;
      const point = desktop
        ? (chooseChatbotPlacement(
            viewport,
            size,
            [...obstacles, ...contentObstacles(scopeElement, host)],
            random,
            visibleScope,
            undefined,
            previousPosition?.getPosition(),
          ) ??
          // Colonne plus étroite que la bulle (connexion) : centrer dans le vide de la colonne entière.
          (column
            ? chooseChatbotPlacement(
                viewport,
                size,
                [...obstacles, ...contentObstacles(scopeElement, host)],
                random,
                { ...visibleScope, left: column.left, width: column.width },
                undefined,
                previousPosition?.getPosition(),
              )
            : null) ??
          chooseChatbotPlacement(
            viewport,
            size,
            obstacles,
            random,
            {
              left: Math.min(
                scope.right + 16,
                window.innerWidth - host.offsetWidth - 40,
              ),
              top: 0,
              width: host.offsetWidth + 40,
              height: window.innerHeight,
            },
            undefined,
            previousPosition?.getPosition(),
          ))
        : chooseChatbotPlacement(
            viewport,
            size,
            [...obstacles, ...contentObstacles(scopeElement, host)],
            random,
            { left: scope.left, top: scope.top, width: scope.width, height: scope.height },
          );
      // Narrow screens use the empty part of the step, scrolling with the page,
      // and only fall back below the card when the step has no room left.
      const target =
        (point && !desktop ? { left: point.left, top: point.top + window.scrollY } : point) ??
        (desktop
          ? {
              left: Math.min(
                scope.right + 24,
                window.innerWidth - host.offsetWidth - 20,
              ),
              top: Math.max(
                20,
                Math.min(
                  scope.top,
                  window.innerHeight - host.offsetHeight - 20,
                ),
              ),
            }
          : {
              left: Math.max(
                20,
                scope.left + (scope.width - host.offsetWidth) / 2,
              ),
              top: scope.bottom + window.scrollY + 24,
            });
      const previous = previousPosition?.getPosition();
      host.getAnimations?.().forEach((animation) => animation.cancel());
      if (!desktop)
        host
          .querySelector<HTMLElement>('[aria-label="Chatbot ANDRIA"]')
          ?.getAnimations?.()
          .forEach((animation) => animation.cancel());
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
        host.animate?.(
          [
            {
              transform: `translate(${previous.left - target.left}px, ${previous.top - target.top}px)`,
            },
            { transform: "translate(0px, 0px)" },
          ],
          { duration: chatbotMoveDurationMs, easing: chatbotMoveEasing },
        );
        const scale = handoffScale.current;
        const avatar = host.querySelector<HTMLElement>(chatbotAvatarSelector);
        if (scale !== null && avatar) {
          avatar.style.transform = "";
          avatar.animate?.(
            [{ transform: `scale(${scale})` }, { transform: "scale(1)" }],
            { duration: chatbotMoveDurationMs, easing: chatbotMoveEasing },
          );
        }
        // The avatar rolls along the move, in the direction it travels, with the same timing.
        const turn = previous.left > target.left ? -360 : 360;
        host
          .querySelector<HTMLElement>('[aria-label="Chatbot ANDRIA"]')
          ?.animate?.(
            [{ transform: "rotate(0deg)" }, { transform: `rotate(${turn}deg)` }],
            { duration: chatbotMoveDurationMs, easing: chatbotMoveEasing },
          );
      }
      // Without a previous location (first dialogue shown), appear in place rather than sliding in.
      if (!previous && !reducedMotion) {
        host.animate?.(
          [
            { opacity: 0, transform: `scale(${chatbotAppearScale})`, transformOrigin: "right center" },
            { opacity: 1, transform: "scale(1)", transformOrigin: "right center" },
          ],
          { duration: chatbotAppearDurationMs, easing: chatbotAppearEasing },
        );
      }
      if (handoffScale.current !== null) {
        host.querySelector<HTMLElement>(chatbotAvatarSelector)?.style.removeProperty("transform");
        handoffScale.current = null;
      }
      previousPosition?.setPosition(target);
      placed.current = true;
    };
    // Measure the settled column, rather than positions mid-way through its intro.
    const timer = window.setTimeout(
      place,
      previousPosition?.getPosition() ? 350 : 700,
    );
    window.addEventListener("resize", place);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", place);
    };
  }, [
    desktop,
    previousPosition,
    random,
    reducedMotion,
    usePortal,
    scopeRef,
    stepId,
    x,
    y,
  ]);

  if (!usePortal) return <div ref={inlineRef} data-chatbot-placement="inline">{children}</div>;
  return (
    <>
      <div ref={anchorRef} aria-hidden="true" />
      {createPortal(
        <AuthChatbotDragContext value={dragContext}>
          <motion.div
            ref={hostRef}
            data-chatbot-placement="page"
            className="fixed z-40 w-[420px] max-w-[calc(100vw-2.5rem)]"
            style={{ x, y, visibility: "hidden" }}
            drag
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={dragBounds}
            dragElastic={0}
            dragMomentum={false}
            onDragStart={() => {
              dragged.current = true;
              setDragging(true);
            }}
            onDragEnd={() => {
              setDragging(false);
              const rect = hostRef.current?.getBoundingClientRect();
              if (rect)
                previousPosition?.setPosition({
                  left: rect.left,
                  top: rect.top,
                });
            }}
          >
            {children}
          </motion.div>
        </AuthChatbotDragContext>,
        document.body,
      )}
    </>
  );
}
