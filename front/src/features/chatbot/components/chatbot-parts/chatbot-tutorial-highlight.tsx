import { useEffect, useRef } from "react";

type Props = { element: HTMLElement };

/** Cadre autour de l'élément que l'assistant virtuel explique. Il suit l'élément sans rendu, même quand la page défile. */
export default function ChatbotTutorialHighlight({ element }: Props) {
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const follow = (): void => {
      const box = frameRef.current;
      const rect = element.getBoundingClientRect();
      if (box) {
        const visible = element.isConnected && rect.width > 0 && rect.height > 0;
        box.style.visibility = visible ? "visible" : "hidden";
        box.style.left = `${rect.left - 4}px`;
        box.style.top = `${rect.top - 4}px`;
        box.style.width = `${rect.width + 8}px`;
        box.style.height = `${rect.height + 8}px`;
      }
      frame = window.requestAnimationFrame(follow);
    };
    follow();
    return () => window.cancelAnimationFrame(frame);
  }, [element]);

  return (
    <div
      ref={frameRef}
      aria-hidden="true"
      className="pointer-events-none fixed z-40 rounded-xl outline-2 outline-offset-2 outline-primary motion-safe:animate-pulse"
      style={{ visibility: "hidden" }}
    />
  );
}
