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
      if (!trigger || activeTrigger.current === trigger) return;
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
    const onPointerOut = (event: PointerEvent) => {
      const trigger = getTrigger(event.target);
      if (trigger && !(event.relatedTarget instanceof Node && trigger.contains(event.relatedTarget))) {
        if (activeTrigger.current === trigger) activeTrigger.current = null;
        setActive((current) => current?.trigger === trigger ? null : current);
      }
    };
    const onFocusIn = (event: FocusEvent) => show(getTrigger(event.target));
    const onFocusOut = (event: FocusEvent) => {
      const trigger = getTrigger(event.target);
      if (trigger && !(event.relatedTarget instanceof Node && trigger.contains(event.relatedTarget))) {
        if (activeTrigger.current === trigger) activeTrigger.current = null;
        setActive((current) => current?.trigger === trigger ? null : current);
      }
    };
    const dismiss = () => {
      activeTrigger.current = null;
      setActive(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };

    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("pointerout", onPointerOut);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", dismiss, true);
    window.addEventListener("resize", dismiss);
    return () => {
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", dismiss, true);
      window.removeEventListener("resize", dismiss);
    };
  }, []);

  useLayoutEffect(() => {
    if (!active || !bubble.current) return;
    const rect = active.trigger.getBoundingClientRect();
    const { offsetWidth: width, offsetHeight: height } = bubble.current;
    const preferred = active.trigger.classList.contains("tooltip-bottom")
      ? "bottom"
      : active.trigger.classList.contains("tooltip-left")
        ? "left"
        : active.trigger.classList.contains("tooltip-right")
          ? "right"
          : "top";
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
      top: clamp(
        side === "top" ? rect.top - height - GAP :
          side === "bottom" ? rect.bottom + GAP :
            rect.top + (rect.height - height) / 2,
        window.innerHeight - height,
      ),
      left: clamp(
        side === "left" ? rect.left - width - GAP :
          side === "right" ? rect.right + GAP :
            rect.left + (rect.width - width) / 2,
        window.innerWidth - width,
      ),
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
