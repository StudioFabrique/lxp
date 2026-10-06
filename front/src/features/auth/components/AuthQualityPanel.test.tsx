import { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import AuthQualityPanel from "./AuthQualityPanel";

it("remplace la croix par un seul bouton Réduire en plein écran", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  let fullscreen: Element | null = null;
  Object.defineProperty(document, "fullscreenElement", { configurable: true, get: () => fullscreen });
  const exit = vi.fn(async () => {
    fullscreen = null;
    document.dispatchEvent(new Event("fullscreenchange"));
  });
  Object.defineProperty(document, "exitFullscreen", { configurable: true, value: exit });
  const onClose = vi.fn();
  try {
    act(() => root.render(<AuthQualityPanel quality={0} colors={["bg-primary text-primary-content"]} colorIndex={0} x={150} y={440}
      geometry={{ width: 1100, height: 790, left: 0, top: 0, visibleWidth: 1000 }} reducedMotion onClose={onClose} onTurnChange={vi.fn()} />));
    expect(container.querySelector('button[aria-label="Fermer les détails"]')).not.toBeNull();
    act(() => {
      fullscreen = container.querySelector("[data-auth-quality-player]");
      document.dispatchEvent(new Event("fullscreenchange"));
    });
    const minimize = container.querySelectorAll<HTMLButtonElement>('button[aria-label="Quitter le plein écran"]');
    expect(minimize).toHaveLength(1);
    expect(minimize[0].textContent).toBe("Réduire");
    expect(container.querySelector('button[aria-label="Fermer les détails"]')).toBeNull();
    await act(async () => minimize[0].click());
    expect(exit).toHaveBeenCalledOnce();
    expect(onClose).not.toHaveBeenCalled();
    expect(container.querySelector('button[aria-label="Fermer les détails"]')).not.toBeNull();
  } finally {
    act(() => root.unmount());
    container.remove();
    Reflect.deleteProperty(document, "fullscreenElement");
    Reflect.deleteProperty(document, "exitFullscreen");
  }
});
