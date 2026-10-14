import { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import AuthQualityPanel from "./AuthQualityPanel";

it("passe en plein écran dans la fenêtre avec un seul bouton Réduire", () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  const onClose = vi.fn();
  try {
    act(() => root.render(<AuthQualityPanel quality={0} colors={["bg-primary text-primary-content"]} colorIndex={0} x={150} y={440}
      geometry={{ width: 1100, height: 790, left: 0, top: 0, visibleWidth: 1000 }} reducedMotion onClose={onClose} onTurnChange={vi.fn()} />));
    expect(container.querySelector('button[aria-label="Fermer les détails"]')).not.toBeNull();
    act(() => window.dispatchEvent(new MessageEvent("message", {
      source: container.querySelector("iframe")!.contentWindow, origin: window.location.origin,
      data: { channel: "andria-auth-presentation", state: "playing" },
    })));
    act(() => container.querySelector<HTMLButtonElement>('button[aria-label="Plein écran"]')!.click());
    expect(container.querySelector("[data-auth-quality-player]")?.hasAttribute("data-fullscreen")).toBe(true);
    const minimize = container.querySelectorAll<HTMLButtonElement>('button[aria-label="Quitter le plein écran"]');
    expect(minimize).toHaveLength(1);
    expect(minimize[0].textContent).toBe("Réduire");
    expect(container.querySelector('button[aria-label="Fermer les détails"]')).toBeNull();
    expect(container.querySelector('[role="group"] button[aria-label^="Animation précédente"]')).not.toBeNull();
    expect(container.querySelector('[role="group"] button[aria-label^="Animation suivante"]')).not.toBeNull();
    act(() => minimize[0].click());
    expect(container.querySelector('[role="group"]')).toBeNull();
    expect(onClose).not.toHaveBeenCalled();
    expect(container.querySelector("[data-auth-quality-player]")?.hasAttribute("data-fullscreen")).toBe(false);
    expect(container.querySelector('button[aria-label="Fermer les détails"]')).not.toBeNull();
  } finally {
    act(() => root.unmount());
    container.remove();
  }
});
