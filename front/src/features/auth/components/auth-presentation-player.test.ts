import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { afterEach, describe, expect, it, vi } from "vitest";

const player = readFileSync(resolve("../brag-output/login-embed/player.js"), "utf8");
const styles = readFileSync(resolve("../brag-output/login-embed/player.css"), "utf8");

describe("embedded presentation initialization", () => {
  afterEach(() => document.body.replaceChildren());

  it.each([true, false])("hides the provisional logo until initialization (autoplay: %s)", (autoplay) => {
    const stylesheet = document.createElement("style");
    stylesheet.textContent = styles;
    const root = document.createElement("div");
    root.id = "root";
    for (const id of ["identity", "emails"]) {
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
      const sequences = [[{ id: 'emails', start: 144.5, duration: 18 }]];
      const opening = { id: 'identity', start: 0, duration: 3 };
      ${player}
    `, {
      window: {
        __timelines: { main: timeline },
        addEventListener: (type: string, listener: typeof onMessage) => {
          if (type === "message") onMessage = listener;
        },
      },
      document, parent, URLSearchParams, location: { search: "?quality=0" },
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
      time: autoplay ? 144.5 : 2.1,
      visibility: "hidden",
      color: "rgb(200, 80, 40)",
    });
    expect(getComputedStyle(root).visibility).toBe("visible");
    expect(root.querySelector<HTMLElement>(autoplay ? "#emails" : "#identity")?.style.display).toBe("block");
  });
});
