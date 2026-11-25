import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type ActiveTooltip = {
  trigger: HTMLElement;
  text: string;
  background: string;
  color: string;
};

const MARGIN = 8;
const GAP = 8;

type Side = "top" | "bottom" | "left" | "right";

function getPreferredSide(trigger: HTMLElement): Side {
  if (trigger.classList.contains("tooltip-bottom")) return "bottom";
  if (trigger.classList.contains("tooltip-left")) return "left";
  if (trigger.classList.contains("tooltip-right")) return "right";
  return "top";
}

function getTop(side: Side, rect: DOMRect, height: number): number {
  if (side === "top") return rect.top - height - GAP;
  if (side === "bottom") return rect.bottom + GAP;
  return rect.top + (rect.height - height) / 2;
}

function getLeft(side: Side, rect: DOMRect, width: number): number {
  if (side === "left") return rect.left - width - GAP;
  if (side === "right") return rect.right + GAP;
  return rect.left + (rect.width - width) / 2;
}

function getTrigger(target: EventTarget | null) {
  return target instanceof Element
    ? target.closest<HTMLElement>(".tooltip[data-tip]:not([data-tip=''])")
    : null;
}

export default function TooltipLayer() {
  const [active, setActive] = useState<ActiveTooltip | null>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const bubble = useRef<HTMLDivElement>(null);
  const activeTrigger = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const show = (trigger: HTMLElement | null) => {
      if (!trigger?.isConnected || activeTrigger.current === trigger) return;
      activeTrigger.current = trigger;
      const style = getComputedStyle(trigger, "::before");
      setPosition(null);
      setActive({
        trigger,
        text: trigger.dataset.tip ?? "",
        background: style.backgroundColor,
        color: style.color,
      });
    };
    const onPointerOver = (event: PointerEvent) => show(getTrigger(event.target));
    const onPointerMove = (event: PointerEvent) => {
      const trigger = getTrigger(event.target);
      if (trigger?.isConnected) show(trigger);
      else if (activeTrigger.current) dismiss();
    };
    const onLeave = (event: PointerEvent | FocusEvent) => {
      const trigger = getTrigger(event.target);
      if (trigger && !(event.relatedTarget instanceof Node && trigger.contains(event.relatedTarget))) {
        if (activeTrigger.current === trigger) activeTrigger.current = null;
        setActive((current) => current?.trigger === trigger ? null : current);
      }
    };
    const onFocusIn = (event: FocusEvent) => show(getTrigger(event.target));
    const dismiss = () => {
      activeTrigger.current = null;
      setActive(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };

    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerout", onLeave);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onLeave);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", dismiss, true);
    window.addEventListener("scroll", dismiss, true);
    window.addEventListener("resize", dismiss);
    return () => {
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerout", onLeave);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onLeave);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", dismiss, true);
      window.removeEventListener("scroll", dismiss, true);
      window.removeEventListener("resize", dismiss);
    };
  }, []);

  useEffect(() => {
    if (!active) return;
    const observer = new MutationObserver(() => {
      if (active.trigger.isConnected) return;
      if (activeTrigger.current === active.trigger) activeTrigger.current = null;
      setActive((current) => current?.trigger === active.trigger ? null : current);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [active]);

  useLayoutEffect(() => {
    if (!active || !bubble.current) return;
    const rect = active.trigger.getBoundingClientRect();
    const { offsetWidth: width, offsetHeight: height } = bubble.current;
    const preferred = getPreferredSide(active.trigger);
    const fits = {
      top: rect.top >= height + GAP + MARGIN,
      bottom: window.innerHeight - rect.bottom >= height + GAP + MARGIN,
      left: rect.left >= width + GAP + MARGIN,
      right: window.innerWidth - rect.right >= width + GAP + MARGIN,
    };
    const side = fits[preferred] ? preferred :
      (["top", "bottom", "right", "left"] as const).find((item) => fits[item]) ?? preferred;
    const clamp = (value: number, max: number) => Math.max(MARGIN, Math.min(value, max - MARGIN));
    setPosition({
      top: clamp(getTop(side, rect, height), window.innerHeight - height),
      left: clamp(getLeft(side, rect, width), window.innerWidth - width),
    });
  }, [active]);

  return active && createPortal(
    <div
      ref={bubble}
      role="tooltip"
      className="pointer-events-none fixed z-[9999] max-w-[min(20rem,calc(100vw-1rem))] rounded-field px-2 py-1 text-center text-sm leading-tight break-words shadow-md"
      style={{
        top: position?.top ?? 0,
        left: position?.left ?? 0,
        visibility: position ? "visible" : "hidden",
        backgroundColor: active.background,
        color: active.color,
      }}
    >
      {active.text}
    </div>,
    document.body,
  );
}
