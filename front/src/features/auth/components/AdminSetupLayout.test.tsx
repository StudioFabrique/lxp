import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AdminSetupLayout from "./AdminSetupLayout";
import { authIntroDurationMs } from "../hooks/useAuthIntro";
import { MemoryRouter } from "react-router";
import Welcome from "./Welcome";

const preference = vi.hoisted(() => ({ reduced: false }));
vi.mock("motion/react", async (importOriginal) => ({
  ...await importOriginal<typeof import("motion/react")>(),
  useReducedMotion: () => preference.reduced,
}));

describe("introduction de l’accueil", () => {
  let container: HTMLDivElement;
  let root: Root;
  beforeEach(() => {
    vi.useFakeTimers();
    preference.reduced = false;
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  });
  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.useRealTimers();
  });

  it("présente un grand logo au centre avant le message", () => {
    act(() => root.render(<AdminSetupLayout isWelcome><h1>Bienvenue sur ANDRIA</h1><button>Commencer</button></AdminSetupLayout>));
    const frame = container.querySelector("iframe");
    expect(frame).not.toBeNull();
    expect(container.querySelector("h1")).toBeNull();
    expect(container.querySelector("button")).toBeNull();
    expect(frame?.closest(".my-auto")).not.toBeNull();
    expect(frame?.closest(".items-center")?.className).toContain("w-[36rem]");
    expect(container.querySelector('[title="Salut animé du chatbot ANDRIA"]')).toBeNull();
    act(() => vi.advanceTimersByTime(1000));
    expect(container.querySelector('[title="Salut animé du chatbot ANDRIA"]')).not.toBeNull();
    expect(container.textContent).toContain("Je serai là pour vous aider.");
    act(() => vi.advanceTimersByTime(authIntroDurationMs - 1001));
    expect(container.querySelector("h1")).toBeNull();
    act(() => vi.advanceTimersByTime(1));
    expect(container.querySelector("h1")?.textContent).toBe("Bienvenue sur ANDRIA");
    expect(Array.from(container.querySelectorAll("button")).some(button => button.textContent === "Commencer")).toBe(true);
    expect(container.querySelector("iframe")).toBe(frame);
    expect(frame?.closest(".my-auto")).toBeNull();
    expect(frame?.closest(".items-center")?.className).toContain("w-72");
    expect(container.querySelector("span.text-primary")?.textContent).toContain("Intelligence Artificielle");
  });

  it("affiche immédiatement l’accueil avec le mouvement réduit", () => {
    preference.reduced = true;
    act(() => root.render(<AdminSetupLayout isWelcome><h1>Bienvenue sur ANDRIA</h1><button>Commencer</button></AdminSetupLayout>));
    expect(container.querySelector("h1")).not.toBeNull();
    expect(container.querySelector("button")).not.toBeNull();
  });

  it("confie les instructions de configuration au chatbot après sa présentation", () => {
    const onNext = vi.fn();
    act(() => root.render(
      <MemoryRouter>
        <AdminSetupLayout isWelcome><Welcome onNext={onNext} /></AdminSetupLayout>
      </MemoryRouter>,
    ));
    act(() => vi.advanceTimersByTime(1000));
    expect(container.textContent).toContain("Je serai là pour vous aider.");
    expect(container.textContent).not.toContain("Configurez votre plateforme");
    act(() => vi.advanceTimersByTime(authIntroDurationMs - 1000));
    const message = Array.from(document.querySelectorAll("[data-chatbot-bubble]")).find(span => span.textContent?.startsWith("Configurez votre plateforme"));
    expect(message?.textContent).toBe("Configurez votre plateforme en créant le premier compte. Il vous permettra de gérer les paramètres de l’instance et les accès à ANDRIA.");
    expect(container.querySelector("p")?.textContent ?? "").not.toContain("Configurez votre plateforme");
    expect(message?.parentElement?.querySelector('[aria-label="Chatbot ANDRIA"]')).not.toBeNull();
    act(() => Array.from(container.querySelectorAll("button")).find(button => button.textContent?.includes("Commencer"))?.click());
    expect(onNext).toHaveBeenCalledOnce();
  });
});
