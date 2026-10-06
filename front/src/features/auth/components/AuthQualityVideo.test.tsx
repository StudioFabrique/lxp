import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AuthQualityVideo from "./AuthQualityVideo";

describe("login Hyperframes presentation", () => {
  let container: HTMLDivElement;
  let root: Root;
  const frame = () => container.querySelector<HTMLIFrameElement>("iframe")!;
  const notify = (state: string, source: MessageEventSource | null = frame().contentWindow, origin = window.location.origin) => {
    act(() => window.dispatchEvent(new MessageEvent("message", {
      source, origin, data: { channel: "andria-auth-presentation", state },
    })));
  };
  beforeEach(() => {
    vi.useFakeTimers();
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  });
  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("plays the matching scenes and offers replay after the final feature", () => {
    act(() => root.render(<AuthQualityVideo quality={3} label="Réactive" colorIndex={1} reducedMotion={false} />));
    expect(frame().getAttribute("src")).toContain("quality=3");
    expect(container.querySelector("figcaption")?.textContent).toContain("Planning et prévention du décrochage");
    expect(container.textContent).not.toContain("Découvrir la plateforme");
    const post = vi.spyOn(frame().contentWindow!, "postMessage");
    notify("ready");
    expect(post).toHaveBeenCalledWith(expect.objectContaining({ action: "initialize", autoplay: true }), window.location.origin);
    notify("playing");
    act(() => container.querySelector<HTMLButtonElement>("button")!.click());
    expect(post).toHaveBeenLastCalledWith(expect.objectContaining({ action: "pause" }), window.location.origin);
    notify("ended");
    expect(container.textContent).toContain("Présentation terminée");
    expect(container.querySelector("button")?.textContent).toBe("Rejouer");
    act(() => container.querySelector<HTMLButtonElement>("button")!.click());
    expect(post).toHaveBeenLastCalledWith(expect.objectContaining({ action: "replay" }), window.location.origin);
  });

  it.each([
    [6, "Collective", "Groupes, promotions et parcours"],
    [7, "Coordonnée", "Formateurs et groupes associés"],
    [8, "Organisée", "Tags et contenus reliés"],
    [9, "Connectée", "Alertes email et disponibilité des contenus"],
    [10, "Personnalisable", "Identité, thèmes et emails de l’instance"],
    [11, "Encourageante", "Accomplissements, félicitations et journal"],
  ] as const)("opens the new sequence %s with its topic", (quality, label, topic) => {
    act(() => root.render(<AuthQualityVideo quality={quality} label={label} colorIndex={0} reducedMotion={false} />));
    expect(frame().getAttribute("src")).toBe(`/presentations/andria/index.html?quality=${quality}`);
    expect(frame().getAttribute("title")).toContain(label);
    expect(container.querySelector("figcaption")?.textContent).toContain(topic);
  });

  it("shows the position of the feature in the tour before its topic", () => {
    act(() => root.render(<AuthQualityVideo quality={0} label="Accessible" colorIndex={0} reducedMotion={false} />));
    const caption = container.querySelector("figcaption")!;
    expect(caption.querySelector(".badge")?.textContent).toBe("1/12");
    expect(caption.textContent).toContain("Étape 1 sur 12 : Parcours pédagogiques et thèmes");
    notify("ended");
    expect(caption.querySelector(".badge")).toBeNull();
  });

  it("offers replay when the final feature ends", () => {
    const onEnded = vi.fn();
    act(() => root.render(<AuthQualityVideo quality={6} label="Collective" colorIndex={0} reducedMotion={false} onEnded={onEnded} />));
    const post = vi.spyOn(frame().contentWindow!, "postMessage");
    notify("playing");
    notify("ended");
    expect(container.querySelector("button")?.textContent).toBe("Rejouer");
    act(() => vi.advanceTimersByTime(1200));
    expect(onEnded).toHaveBeenCalledOnce();
    act(() => container.querySelector<HTMLButtonElement>("button")!.click());
    expect(post).toHaveBeenLastCalledWith(expect.objectContaining({ action: "replay" }), window.location.origin);
  });

  it("does not autoplay when reduced motion is requested", () => {
    act(() => root.render(<AuthQualityVideo quality={5} label="Adaptative" colorIndex={2} reducedMotion />));
    const post = vi.spyOn(frame().contentWindow!, "postMessage");
    notify("ready");
    expect(post).toHaveBeenCalledWith(expect.objectContaining({ autoplay: false }), window.location.origin);
  });

  it("ignores messages from other frames, origins and invalid states", () => {
    act(() => root.render(<AuthQualityVideo quality={0} label="Accessible" colorIndex={0} reducedMotion={false} />));
    notify("ended", window);
    notify("ended", frame().contentWindow, "https://untrusted.example");
    notify("invalid");
    expect(container.querySelector("button")?.textContent).toBe("Lire");
    expect(container.querySelector("button")?.disabled).toBe(true);
  });

  it("keeps the frame mounted when its tile color changes", () => {
    act(() => root.render(<AuthQualityVideo quality={0} label="Accessible" colorIndex={0} reducedMotion={false} />));
    const firstFrame = frame();
    const post = vi.spyOn(firstFrame.contentWindow!, "postMessage");
    act(() => root.render(<AuthQualityVideo quality={0} label="Accessible" colorIndex={2} reducedMotion={false} />));
    expect(frame()).toBe(firstFrame);
    expect(post).toHaveBeenCalledWith(expect.objectContaining({ action: "color" }), window.location.origin);
  });

  it("passes the tile and page palette to the embedded interfaces", () => {
    act(() => root.render(<AuthQualityVideo quality={0} label="Accessible" colorIndex={0} reducedMotion={false} />));
    const probe = container.querySelector<HTMLSpanElement>('span[aria-hidden="true"]')!;
    probe.style.color = "rgb(5, 150, 105)";
    probe.style.outlineColor = "rgb(255, 255, 255)";
    probe.style.backgroundColor = "rgb(239, 248, 255)";
    probe.style.borderColor = "rgb(12, 74, 110)";
    const post = vi.spyOn(frame().contentWindow!, "postMessage");
    notify("ready");
    expect(post).toHaveBeenCalledWith(expect.objectContaining({
      color: "rgb(5, 150, 105)", contentColor: "rgb(255, 255, 255)",
      backgroundColor: "rgb(239, 248, 255)", textColor: "rgb(12, 74, 110)",
    }), window.location.origin);
  });

  it("offers retry if the local player does not start", () => {
    act(() => root.render(<AuthQualityVideo quality={0} label="Accessible" colorIndex={0} reducedMotion={false} />));
    const firstFrame = frame();
    act(() => vi.advanceTimersByTime(10000));
    expect(container.querySelector('[role="alert"]')?.textContent).toContain("n’a pas pu démarrer");
    act(() => container.querySelector<HTMLButtonElement>("button")!.click());
    expect(frame()).not.toBe(firstFrame);
    expect(container.querySelector('[role="alert"]')).toBeNull();
  });

  it("enters fullscreen and reflects the browser's exit", async () => {
    let fullscreenElement: Element | null = null;
    Object.defineProperty(document, "fullscreenElement", { configurable: true, get: () => fullscreenElement });
    const request = vi.fn(async () => {
      fullscreenElement = container.querySelector("figure");
      document.dispatchEvent(new Event("fullscreenchange"));
    });
    const exit = vi.fn(async () => {
      fullscreenElement = null;
      document.dispatchEvent(new Event("fullscreenchange"));
    });
    Object.defineProperty(HTMLElement.prototype, "requestFullscreen", { configurable: true, value: request });
    Object.defineProperty(document, "exitFullscreen", { configurable: true, value: exit });
    try {
      act(() => root.render(<AuthQualityVideo quality={0} label="Accessible" colorIndex={0} reducedMotion={false} />));
      notify("playing");
      await act(async () => container.querySelector<HTMLButtonElement>('button[aria-label="Plein écran"]')!.click());
      expect(request).toHaveBeenCalledOnce();
      expect(fullscreenElement).toBe(container.querySelector("figure"));
      expect(container.querySelector('button[aria-label="Quitter le plein écran"]')).not.toBeNull();
      await act(async () => container.querySelector<HTMLButtonElement>('button[aria-label="Quitter le plein écran"]')!.click());
      expect(exit).toHaveBeenCalledOnce();
      expect(container.querySelector('button[aria-label="Plein écran"]')).not.toBeNull();
    } finally {
      Reflect.deleteProperty(HTMLElement.prototype, "requestFullscreen");
      Reflect.deleteProperty(document, "exitFullscreen");
      Reflect.deleteProperty(document, "fullscreenElement");
    }
  });

  it("advances after holding the ANDRIA ending and cancels advancement on replay", () => {
    const onEnded = vi.fn();
    act(() => root.render(<AuthQualityVideo quality={0} label="Accessible" colorIndex={0} reducedMotion={false} onEnded={onEnded} />));
    notify("playing");
    notify("ended");
    act(() => vi.advanceTimersByTime(1199));
    expect(onEnded).not.toHaveBeenCalled();
    notify("playing");
    act(() => vi.advanceTimersByTime(1200));
    expect(onEnded).not.toHaveBeenCalled();
    notify("ended");
    act(() => vi.advanceTimersByTime(1200));
    expect(onEnded).toHaveBeenCalledOnce();
  });

  it("keeps the final feature still instead of advancing with reduced motion", () => {
    const onEnded = vi.fn();
    act(() => root.render(<AuthQualityVideo quality={0} label="Accessible" colorIndex={0} reducedMotion onEnded={onEnded} />));
    notify("ended");
    act(() => vi.advanceTimersByTime(5000));
    expect(onEnded).not.toHaveBeenCalled();
  });
});
