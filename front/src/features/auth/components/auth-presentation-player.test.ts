import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { afterEach, describe, expect, it, vi } from "vitest";

const player = readFileSync(resolve("../brag-output/login-embed/player.js"), "utf8");
const styles = readFileSync(resolve("../brag-output/login-embed/player.css"), "utf8");

describe("embedded presentation initialization", () => {
  afterEach(() => document.body.replaceChildren());

  it.each([true, false])("fits the preview and fullscreen without losing its center (zoom: %s)", (supportsZoom) => {
    const root = document.createElement("div");
    root.id = "root";
    document.body.append(root);
    let resize: (() => void) | undefined;
    const viewport = {
      innerWidth: 586, innerHeight: 304,
      window: {
        __timelines: { main: { totalTime: vi.fn() } },
        addEventListener: (type: string, listener: () => void) => { if (type === "resize") resize = listener; },
      },
      document, parent: { postMessage: vi.fn() }, URLSearchParams,
      location: { search: "?quality=0" }, getComputedStyle,
      CSS: { supports: (property: string) => property !== "zoom" || supportsZoom },
      requestAnimationFrame: vi.fn(), cancelAnimationFrame: vi.fn(),
    };
    runInNewContext(`
      const sequences = [[{ id: 'emails', start: 144.5, duration: 18 }], [{ id: 'dashboards', start: 80.5, duration: 13 }]];
      const opening = { id: 'identity', start: 0, duration: 3 };
      ${player}
    `, viewport);
    const assertCentered = () => {
      const scale = Math.min(viewport.innerWidth / 1920, viewport.innerHeight / 1080);
      expect(root.style.transform).toBe(supportsZoom ? "none" : `scale(${scale})`);
      expect(root.style.zoom).toBe(supportsZoom ? String(scale) : "1");
      const positionScale = supportsZoom ? scale : 1;
      expect(parseFloat(root.style.left) * positionScale + 1920 * scale / 2).toBeCloseTo(viewport.innerWidth / 2);
      expect(parseFloat(root.style.top) * positionScale + 1080 * scale / 2).toBeCloseTo(viewport.innerHeight / 2);
    };
    assertCentered();
    viewport.innerWidth = 1546;
    viewport.innerHeight = 871;
    resize?.();
    assertCentered();
    viewport.innerWidth = 586;
    viewport.innerHeight = 304;
    resize?.();
    assertCentered();
  });

  it.each([[true, false, false], [false, false, false], [true, true, false], [false, true, false], [true, false, true], [false, false, true]])("hides the provisional scene until initialization (autoplay: %s, logo: %s, chatbot: %s)", (autoplay, logoOnly, chatbotOnly) => {
    const stylesheet = document.createElement("style");
    stylesheet.textContent = styles;
    const root = document.createElement("div");
    root.id = "root";
    for (const id of ["identity", "emails", "dashboards"]) {
      const scene = document.createElement("section");
      scene.id = id;
      scene.className = "scene";
      root.append(scene);
    }
    document.body.append(stylesheet, root);
    let onMessage: ((event: { source: object; data: object }) => void) | undefined;
    const parent = { postMessage: vi.fn() };
    const paints: { time: number; visibility: string; color: string }[] = [];
    const timeline = {
      totalTime: (time: number) => paints.push({
        time,
        visibility: getComputedStyle(root).visibility,
        color: root.style.getPropertyValue("--embed-logo-color"),
      }),
    };
    runInNewContext(`
      const sequences = [[{ id: 'emails', start: 144.5, duration: 18 }], [{ id: 'dashboards', start: 80.5, duration: 13 }]];
      const opening = { id: 'identity', start: 0, duration: 3 };
      ${player}
    `, {
      window: {
        __timelines: { main: timeline },
        addEventListener: (type: string, listener: typeof onMessage) => {
          if (type === "message") onMessage = listener;
        },
      },
      document, parent, URLSearchParams, location: { search: logoOnly ? "?mode=logo" : chatbotOnly ? "?mode=chatbot" : "?quality=0" },
      innerWidth: 1920, innerHeight: 1080, getComputedStyle,
      CSS: { supports: () => true },
      requestAnimationFrame: vi.fn(), cancelAnimationFrame: vi.fn(),
    });
    expect(getComputedStyle(root).visibility).toBe("hidden");
    expect(parent.postMessage).toHaveBeenLastCalledWith(expect.objectContaining({ state: "ready" }), "*");
    onMessage?.({ source: parent, data: {
      channel: "andria-auth-presentation", action: "initialize",
      color: "rgb(200, 80, 40)", autoplay,
    } });
    expect(paints[paints.length - 1]).toEqual({
      time: logoOnly ? (autoplay ? 0.08 : 2.1) : chatbotOnly ? (autoplay ? 91.1 : 93.499) : (autoplay ? 144.5 : 162.499),
      visibility: "hidden",
      color: "rgb(200, 80, 40)",
    });
    expect(getComputedStyle(root).visibility).toBe("visible");
    expect(root.querySelector<HTMLElement>(logoOnly ? "#identity" : chatbotOnly ? "#dashboards" : "#emails")?.style.display).toBe("block");
  });
});
