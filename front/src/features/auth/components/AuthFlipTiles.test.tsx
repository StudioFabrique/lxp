import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AuthFlipTiles from "./AuthFlipTiles";
import { getExpandedTileBounds, getVisibleAuthTiles } from "./auth-tile-grid";

const preferences = vi.hoisted(() => ({ reducedMotion: false }));
vi.mock("motion/react", async () => {
  const React = await import("react");
  function MockMotionDiv({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { initial?: unknown; animate?: unknown; exit?: unknown; transition?: { duration?: number }; onAnimationComplete?: () => void }) {
    const { initial, animate, exit, transition, onAnimationComplete, ...htmlProps } = props;
    void initial; void animate; void exit;
    React.useEffect(() => {
      if (!onAnimationComplete) return;
      const timer = setTimeout(onAnimationComplete, (transition?.duration ?? 0) * 1000);
      return () => clearTimeout(timer);
    }, [onAnimationComplete, transition]);
    return React.createElement("div", htmlProps, children);
  }
  return {
    useReducedMotion: () => preferences.reducedMotion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
    motion: { div: MockMotionDiv },
  };
});

describe("auth flip tiles", () => {
  let container: HTMLDivElement;
  let image: HTMLImageElement;
  let root: Root;
  let resize: () => void;
  const onClipPathChange = (value: string) => { image.style.clipPath = value; };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0.99);
    preferences.reducedMotion = false;
    vi.spyOn(document, "hidden", "get").mockReturnValue(false);
    vi.stubGlobal("ResizeObserver", class {
      constructor(callback: () => void) { resize = callback; }
      observe() {}
      disconnect() {}
    });
    container = document.createElement("div");
    image = document.createElement("img");
    image.src = "/photo.jpg";
    const host = document.createElement("div");
    container.append(image, host);
    document.body.append(container);
    const bounds = { width: 1100, height: 900, left: 0, top: 0 } as DOMRect;
    vi.spyOn(image, "getBoundingClientRect").mockReturnValue(bounds);
    vi.spyOn(container, "getBoundingClientRect").mockReturnValue(bounds);
    root = createRoot(host);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("keeps the three fixed positions and crops edge tiles with the photo", () => {
    expect(getVisibleAuthTiles({ width: 800, height: 650, left: -100, top: 0, visibleWidth: 650 }))
      .toEqual([{ x: 150, y: 440 }, { x: 460, y: 440 }]);
    expect(getVisibleAuthTiles({ width: 400, height: 600, left: 0, top: 0, visibleWidth: 400 }))
      .toEqual([{ x: 150, y: 440 }]);
    expect(getVisibleAuthTiles({ width: 1100, height: 900, left: 0, top: 0, visibleWidth: 1100 }))
      .toEqual([{ x: 150, y: 440 }, { x: 460, y: 440 }, { x: 770, y: 440 }]);
    expect(getVisibleAuthTiles({ width: 1100, height: 400, left: 0, top: 0, visibleWidth: 1100 }))
      .toEqual([]);
  });

  it("expands to two columns and rows without leaving the visible image", () => {
    const geometry = { width: 1100, height: 900, left: 0, top: 0, visibleWidth: 1100 };
    expect(getExpandedTileBounds(geometry)).toEqual({ left: 150, top: 180, width: 610, height: 510 });
    expect(getExpandedTileBounds({ ...geometry, left: -100, visibleWidth: 700 }))
      .toEqual({ left: 150, top: 180, width: 610, height: 510 });
  });

  it("appears quickly, staggers the cards and allows occasional overlaps", () => {
    act(() => root.render(<AuthFlipTiles image={image} onClipPathChange={onClipPathChange} />));
    act(() => vi.advanceTimersByTime(799));
    expect(container.querySelectorAll(".auth-flip-tile")).toHaveLength(0);
    act(() => vi.advanceTimersByTime(1));
    expect(container.querySelectorAll(".auth-flip-tile")).toHaveLength(1);
    expect(image.style.clipPath).toContain("evenodd");
    act(() => vi.advanceTimersByTime(1300));
    expect(container.querySelectorAll(".auth-flip-tile")).toHaveLength(2);
    act(() => vi.advanceTimersByTime(1300));
    expect(container.querySelectorAll(".auth-flip-tile")).toHaveLength(3);
    act(() => vi.advanceTimersByTime(4400));
    expect(container.querySelectorAll(".auth-flip-tile")).toHaveLength(2);
    act(() => vi.advanceTimersByTime(2600));
    expect(container.querySelectorAll(".auth-flip-tile")).toHaveLength(0);
    expect(image.style.clipPath).toBe("");
    act(() => vi.advanceTimersByTime(1500));
    expect(container.querySelectorAll(".auth-flip-tile")).toHaveLength(1);
    act(() => resize());
    expect(container.querySelectorAll(".auth-flip-tile")).toHaveLength(0);
    expect(image.style.clipPath).toBe("");
  });

  it("keeps other visible cards and their animations when one card is hovered", () => {
    act(() => root.render(<AuthFlipTiles image={image} onClipPathChange={onClipPathChange} />));
    act(() => vi.advanceTimersByTime(2100));
    const buttons = container.querySelectorAll<HTMLButtonElement>(".auth-tile-button");
    const otherAnimation = buttons[1].querySelector(".auth-flip-tile");
    expect(otherAnimation).not.toBeNull();
    act(() => buttons[0].dispatchEvent(new MouseEvent("mouseover", { bubbles: true })));
    expect(buttons[1].disabled).toBe(false);
    expect(buttons[1].querySelector(".auth-flip-tile")).toBe(otherAnimation);
    expect(otherAnimation?.classList.contains("auth-tile-revealed")).toBe(false);
    act(() => buttons[0].dispatchEvent(new MouseEvent("mouseout", { bubbles: true, relatedTarget: document.body })));
    expect(buttons[1].querySelector(".auth-flip-tile")).toBe(otherAnimation);
    act(() => vi.advanceTimersByTime(2000));
    expect(buttons[1].disabled).toBe(false);
  });

  it("pauses other card animations while details are expanded", () => {
    act(() => root.render(<AuthFlipTiles image={image} onClipPathChange={onClipPathChange} />));
    act(() => vi.advanceTimersByTime(2100));
    const buttons = container.querySelectorAll<HTMLButtonElement>(".auth-tile-button");
    act(() => buttons[0].click());
    expect(image.style.clipPath).toContain("M150 180h610v510h-610Z");
    expect(image.style.clipPath).not.toContain("M150 440h300v250h-300Z");
    expect(container.querySelectorAll("[data-auth-photo-fade] img")).toHaveLength(4);
    const other = buttons[1].querySelector(".auth-flip-tile");
    const otherLabel = buttons[1].textContent;
    expect(other?.className).toContain("animation-play-state:paused");
    act(() => vi.advanceTimersByTime(20000));
    expect(buttons[1].querySelector(".auth-flip-tile")).toBe(other);
    expect(buttons[2].disabled).toBe(true);
    act(() => (container.querySelector('[role="dialog"] button[aria-label="Fermer les détails"]') as HTMLButtonElement).click());
    expect(buttons[1].querySelector(".auth-flip-tile")?.className).not.toContain("animation-play-state:paused");
    act(() => vi.advanceTimersByTime(5000));
    expect(buttons[1].textContent).toBe(otherLabel);
    expect(buttons[2].disabled).toBe(true);
    act(() => vi.advanceTimersByTime(1000));
    expect(buttons[1].disabled).toBe(false);
    act(() => vi.advanceTimersByTime(1000));
    expect(buttons[1].disabled).toBe(true);
  });

  it("keeps the clicked right tile at its original grid position after closing", () => {
    act(() => root.render(<AuthFlipTiles image={image} onClipPathChange={onClipPathChange} />));
    act(() => vi.advanceTimersByTime(3400));
    const right = container.querySelectorAll<HTMLButtonElement>(".auth-tile-button")[2];
    const originalLeft = right.style.left;
    const originalTop = right.style.top;
    act(() => right.focus());
    const focus = vi.spyOn(right, "focus");
    act(() => right.click());
    expect(right.style.left).toBe(originalLeft);
    expect(right.style.top).toBe(originalTop);
    act(() => (container.querySelector('[role="dialog"] button[aria-label="Fermer les détails"]') as HTMLButtonElement).click());
    expect(right.style.left).toBe(originalLeft);
    expect(right.style.top).toBe(originalTop);
    expect(right.disabled).toBe(false);
    expect(focus).toHaveBeenCalledWith({ preventScroll: true });
  });

  it("returns a card clicked before its first flip has finished", () => {
    act(() => root.render(<AuthFlipTiles image={image} onClipPathChange={onClipPathChange} />));
    act(() => vi.advanceTimersByTime(800));
    const button = container.querySelector<HTMLButtonElement>(".auth-tile-button")!;
    act(() => button.click());
    act(() => (container.querySelector('[role="dialog"] button[aria-label="Fermer les détails"]') as HTMLButtonElement).click());
    expect(button.disabled).toBe(false);
    act(() => vi.advanceTimersByTime(4000));
    expect(button.disabled).toBe(true);
  });

  it("gives each card its own return delay when hovering several in succession", () => {
    act(() => root.render(<AuthFlipTiles image={image} onClipPathChange={onClipPathChange} />));
    act(() => vi.advanceTimersByTime(3400));
    const buttons = container.querySelectorAll<HTMLButtonElement>(".auth-tile-button");
    const enter = (index: number) => act(() => buttons[index].dispatchEvent(new MouseEvent("mouseover", { bubbles: true })));
    const leave = (index: number) => act(() => buttons[index].dispatchEvent(new MouseEvent("mouseout", { bubbles: true, relatedTarget: document.body })));
    enter(0);
    leave(0);
    act(() => vi.advanceTimersByTime(1000));
    enter(1);
    leave(1);
    act(() => vi.advanceTimersByTime(1000));
    enter(2);
    leave(2);
    expect(container.querySelectorAll(".auth-tile-returning")).toHaveLength(3);
    act(() => vi.advanceTimersByTime(1999));
    expect(buttons[0].disabled).toBe(false);
    act(() => vi.advanceTimersByTime(1));
    expect(buttons[0].disabled).toBe(true);
    expect(buttons[1].disabled).toBe(false);
    expect(buttons[2].disabled).toBe(false);
    act(() => vi.advanceTimersByTime(1000));
    expect(buttons[1].disabled).toBe(true);
    expect(buttons[2].disabled).toBe(false);
    act(() => vi.advanceTimersByTime(1000));
    expect(buttons[2].disabled).toBe(true);
  });

  it("does not expose details or hover interactions before a card appears", () => {
    act(() => root.render(<AuthFlipTiles image={image} onClipPathChange={onClipPathChange} />));
    const button = container.querySelector<HTMLButtonElement>("button")!;
    expect(button.disabled).toBe(true);
    expect(button.tabIndex).toBe(-1);
    act(() => { button.click(); button.dispatchEvent(new MouseEvent("mouseover", { bubbles: true })); });
    expect(container.querySelector('[role="dialog"]')).toBeNull();
    expect(container.querySelector(".auth-flip-tile")).toBeNull();
    act(() => vi.advanceTimersByTime(800));
    expect(button.disabled).toBe(false);
    act(() => vi.advanceTimersByTime(7000));
    expect(button.disabled).toBe(true);
  });

  it("reveals a card on hover, keeps it visible, and opens its matching details", () => {
    act(() => root.render(<AuthFlipTiles image={image} onClipPathChange={onClipPathChange} />));
    act(() => vi.advanceTimersByTime(800));
    const button = container.querySelector<HTMLButtonElement>("button")!;
    act(() => button.dispatchEvent(new MouseEvent("mouseover", { bubbles: true })));
    expect(container.querySelector(".auth-tile-revealed")).toBeNull();
    act(() => vi.advanceTimersByTime(980));
    expect(container.querySelector(".auth-tile-revealed")).not.toBeNull();
    expect(container.textContent).toContain("Adaptative");
    act(() => vi.advanceTimersByTime(20000));
    expect(container.textContent).toContain("Adaptative");
    act(() => button.click());
    expect(container.querySelector('[role="dialog"] h2')?.textContent).toBe("Adaptative");
    expect(container.querySelector('[role="dialog"] h3')).toBeNull();
    act(() => vi.advanceTimersByTime(349));
    expect(container.querySelector('[role="dialog"] h3')).toBeNull();
    act(() => vi.advanceTimersByTime(1));
    expect(container.querySelectorAll('[role="dialog"] li')).toHaveLength(3);
    act(() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })));
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });

  it("keeps the card visible after hover ends before returning to the photo", () => {
    act(() => root.render(<AuthFlipTiles image={image} onClipPathChange={onClipPathChange} />));
    act(() => vi.advanceTimersByTime(800));
    const button = container.querySelector<HTMLButtonElement>("button")!;
    act(() => button.dispatchEvent(new MouseEvent("mouseover", { bubbles: true })));
    act(() => button.dispatchEvent(new MouseEvent("mouseout", { bubbles: true, relatedTarget: document.body })));
    expect(container.querySelector(".auth-tile-returning")).toBeNull();
    act(() => vi.advanceTimersByTime(980));
    expect(container.querySelector(".auth-tile-returning")).not.toBeNull();
    act(() => vi.advanceTimersByTime(3000));
    expect(button.disabled).toBe(false);
    act(() => vi.advanceTimersByTime(1000));
    expect(button.disabled).toBe(true);
  });

  it("does not let the original automatic timer remove a hovered card", () => {
    act(() => root.render(<AuthFlipTiles image={image} onClipPathChange={onClipPathChange} />));
    act(() => vi.advanceTimersByTime(1780));
    const button = container.querySelector<HTMLButtonElement>("button")!;
    act(() => button.dispatchEvent(new MouseEvent("mouseover", { bubbles: true })));
    act(() => vi.advanceTimersByTime(7000));
    expect(button.disabled).toBe(false);
    expect(button.querySelector(".auth-tile-revealed")).not.toBeNull();
    act(() => button.dispatchEvent(new MouseEvent("mouseout", { bubbles: true, relatedTarget: document.body })));
    act(() => vi.advanceTimersByTime(3999));
    expect(button.disabled).toBe(false);
    act(() => vi.advanceTimersByTime(1));
    expect(button.disabled).toBe(true);
  });

  it("supports keyboard focus and details even with reduced motion", () => {
    preferences.reducedMotion = true;
    act(() => root.render(<AuthFlipTiles image={image} onClipPathChange={onClipPathChange} />));
    const button = container.querySelector<HTMLButtonElement>("button")!;
    act(() => button.focus());
    expect(container.querySelector(".auth-tile-revealed")).not.toBeNull();
    act(() => button.click());
    expect(container.querySelector('[role="dialog"]')).not.toBeNull();
    act(() => (container.querySelector('[role="dialog"] button[aria-label="Fermer les détails"]') as HTMLButtonElement).click());
    expect(document.activeElement).toBe(button);
    act(() => vi.advanceTimersByTime(30000));
    expect(container.querySelectorAll(".auth-tile-revealed")).toHaveLength(3);
  });

  it("preserves open details and uses the new photo when the theme background changes", () => {
    act(() => root.render(<AuthFlipTiles image={image} imageSrc="/light.jpg" onClipPathChange={onClipPathChange} />));
    act(() => vi.advanceTimersByTime(800));
    act(() => container.querySelector<HTMLButtonElement>("button")!.click());
    const dialog = container.querySelector('[role="dialog"]');
    act(() => root.render(<AuthFlipTiles image={image} imageSrc="/dark.jpg" onClipPathChange={onClipPathChange} />));
    expect(container.querySelector('[role="dialog"]')).toBe(dialog);
    expect(container.querySelector('[role="dialog"] h2')?.textContent).toBe("Adaptative");
    act(() => (container.querySelector('[role="dialog"] button[aria-label="Fermer les détails"]') as HTMLButtonElement).click());
    expect(container.querySelector(".auth-flip-face img")?.getAttribute("src")).toBe("/dark.jpg");
  });

  it("cleans up the cutouts and timer when unmounted", () => {
    act(() => root.render(<AuthFlipTiles image={image} onClipPathChange={onClipPathChange} />));
    act(() => vi.advanceTimersByTime(10000));
    act(() => root.render(null));
    expect(image.style.clipPath).toBe("");
    expect(vi.getTimerCount()).toBe(0);
  });

  it("shows static interactive cards when reduced motion is requested", () => {
    preferences.reducedMotion = true;
    act(() => root.render(<AuthFlipTiles image={image} onClipPathChange={onClipPathChange} />));
    act(() => vi.advanceTimersByTime(30000));
    expect(container.querySelectorAll(".auth-tile-revealed")).toHaveLength(3);
    expect(image.style.clipPath).toContain("evenodd");
    expect(vi.getTimerCount()).toBe(0);
  });
});
