import { act, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import LoginRightColumn from "./LoginRightColumn";

vi.mock("./AuthFlipTiles", () => ({
  default: function MockAuthFlipTiles({ imageSrc }: { imageSrc: string }) {
    const [open, setOpen] = useState(false);
    return <button data-photo={imageSrc} onClick={() => setOpen(true)}>{open ? "Details open" : "Tiles"}</button>;
  },
}));
const light = { id: "light", url: "/light.jpg", alt: "Light", author: { name: "Author", profileUrl: "/author" } };
const dark = { ...light, id: "dark", url: "/dark.jpg", alt: "Dark" };

describe("auth background theme transitions", () => {
  let container: HTMLDivElement;
  let root: Root;
  const load = (selector: string) => act(() => container.querySelector(selector)!.dispatchEvent(new Event("load")));
  beforeEach(() => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  });
  afterEach(() => { act(() => root.unmount()); container.remove(); });

  it("keeps the photo and card state until the next theme image is ready", () => {
    act(() => root.render(<LoginRightColumn background={light} isFailed={false} />));
    load('img[aria-hidden="true"]');
    load('img[alt="Light"]');
    const photo = container.querySelector('img[alt="Light"]');
    act(() => container.querySelector("button")!.click());
    act(() => root.render(<LoginRightColumn background={null} isFailed={false} />));
    expect(container.querySelector('img[alt="Light"]')).toBe(photo);
    act(() => root.render(<LoginRightColumn background={dark} isFailed={false} />));
    expect(photo?.getAttribute("src")).toBe("/light.jpg");
    load('img[aria-hidden="true"]');
    expect(container.querySelector('img[alt="Dark"]')).toBe(photo);
    expect(container.querySelector("button")?.textContent).toBe("Details open");
    expect(container.querySelector("button")?.getAttribute("data-photo")).toBe("/dark.jpg");
  });

  it("keeps the fallback image mounted while another theme loads", () => {
    act(() => root.render(<LoginRightColumn background={null} isFailed />));
    load('img[alt="Décoration"]');
    const photo = container.querySelector("img");
    act(() => container.querySelector("button")!.click());
    act(() => root.render(<LoginRightColumn background={null} isFailed={false} />));
    expect(container.querySelector("img")).toBe(photo);
    expect(container.querySelector("button")?.textContent).toBe("Details open");
  });
});
