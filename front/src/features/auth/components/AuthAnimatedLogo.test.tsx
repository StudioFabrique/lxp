import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AuthAnimatedLogo from "./AuthAnimatedLogo";

const preference = vi.hoisted(() => ({ reduced: false }));
vi.mock("motion/react", async (importOriginal) => ({
  ...await importOriginal<typeof import("motion/react")>(),
  useReducedMotion: () => preference.reduced,
}));

describe("logo animé commun aux écrans d’accueil", () => {
  let container: HTMLDivElement;
  let root: Root;
  beforeEach(() => {
    preference.reduced = false;
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  });
  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    document.documentElement.removeAttribute("data-theme");
    vi.restoreAllMocks();
  });

  it.each([false, true])("transmet la palette et respecte le mouvement réduit (%s)", async (reduced) => {
    preference.reduced = reduced;
    act(() => root.render(<AuthAnimatedLogo />));
    const frame = container.querySelector<HTMLIFrameElement>("iframe")!;
    expect(frame.getAttribute("src")).toContain("mode=logo");
    expect(frame.getAttribute("src")).toContain("brand.html");
    expect(container.querySelector("svg")).toBeNull();
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector('[role="img"]')?.getAttribute("aria-label")).toBe("logo ANDRIA");
    const palette = container.querySelector<HTMLElement>('[role="img"]')!;
    palette.style.color = "rgb(10, 80, 140)";
    palette.style.backgroundColor = "rgb(240, 250, 255)";
    const post = vi.spyOn(frame.contentWindow!, "postMessage");
    act(() => window.dispatchEvent(new MessageEvent("message", {
      source: frame.contentWindow, origin: window.location.origin,
      data: { channel: "andria-auth-presentation", state: "ready" },
    })));
    expect(post).toHaveBeenLastCalledWith(expect.objectContaining({
      action: "initialize", color: "rgb(10, 80, 140)",
      backgroundColor: "rgb(240, 250, 255)", autoplay: !reduced,
    }), window.location.origin);
    expect(frame.classList.contains("opacity-0")).toBe(true);
    act(() => window.dispatchEvent(new MessageEvent("message", {
      source: frame.contentWindow, origin: window.location.origin,
      data: { channel: "andria-auth-presentation", state: reduced ? "ended" : "outro" },
    })));
    expect(frame.classList.contains("opacity-0")).toBe(false);
    palette.style.color = "rgb(140, 80, 10)";
    palette.style.colorScheme = "dark";
    await act(async () => { document.documentElement.dataset.theme = "dark"; });
    expect(post).toHaveBeenLastCalledWith(expect.objectContaining({ action: "color", color: "rgb(140, 80, 10)", colorScheme: "dark" }), window.location.origin);
    expect(frame.style.colorScheme).toBe("dark");
    expect(container.querySelector("iframe")).toBe(frame);
  });

  it("ignore les messages provenant d’une autre fenêtre", () => {
    act(() => root.render(<AuthAnimatedLogo />));
    const frame = container.querySelector<HTMLIFrameElement>("iframe")!;
    const post = vi.spyOn(frame.contentWindow!, "postMessage");
    act(() => window.dispatchEvent(new MessageEvent("message", {
      source: window, origin: window.location.origin,
      data: { channel: "andria-auth-presentation", state: "ready" },
    })));
    expect(post).not.toHaveBeenCalled();
    expect(frame.classList.contains("opacity-0")).toBe(true);
  });
});
