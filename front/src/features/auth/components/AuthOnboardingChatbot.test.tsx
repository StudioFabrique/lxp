import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AuthOnboardingChatbot from "./AuthOnboardingChatbot";
import AuthChatbotProvider from "./AuthChatbotProvider";

describe("questions radiales du chatbot", () => {
  let container: HTMLDivElement;
  let root: Root;
  beforeEach(() => {
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

  it("ouvre trois questions séparées et anime le personnage au choix d’une question", async () => {
    vi.useFakeTimers();
    act(() => root.render(<section><AuthOnboardingChatbot introduction={false} message="Indiquez votre clé d’activation." /></section>));
    const avatar = document.querySelector<HTMLButtonElement>('button[aria-label="Afficher les questions d’aide du chatbot ANDRIA"]')!;
    const frame = document.querySelector<HTMLIFrameElement>("iframe")!;
    const replay = vi.spyOn(frame.contentWindow!, "postMessage");
    expect(document.querySelector('ul[aria-label="Questions d’aide"]')).toBeNull();
    act(() => avatar.click());
    const questions = document.querySelector('ul[aria-label="Questions d’aide"]')!;
    expect(avatar.getAttribute("aria-expanded")).toBe("true");
    expect(questions.querySelectorAll("li")).toHaveLength(3);
    expect(Array.from(questions.querySelectorAll("li")).every(item => item.classList.contains("fixed"))).toBe(true);
    act(() => questions.querySelector<HTMLButtonElement>("button")!.click());
    expect(questions.textContent).not.toContain("Indiquez votre clé d’activation.");
    expect(questions.querySelector("button")!.classList.contains("rounded-full")).toBe(true);
    const previousGesture = replay.mock.calls[replay.mock.calls.length - 1]?.[0].gesture;
    expect(replay).toHaveBeenLastCalledWith(expect.objectContaining({ action: "replay" }), window.location.origin);
    expect(avatar.getAttribute("aria-expanded")).toBe("false");
    await act(async () => { await vi.advanceTimersByTimeAsync(200); });
    expect(document.querySelector('[aria-label="ANDRIA prépare sa réponse"]')).not.toBeNull();
    await act(async () => { await vi.advanceTimersByTimeAsync(1100); });
    act(() => avatar.click());
    act(() => document.querySelectorAll<HTMLButtonElement>('ul[aria-label="Questions d’aide"] button')[1].click());
    expect(document.body.textContent).not.toContain("Renseignez les informations demandées");
    await act(async () => { await vi.advanceTimersByTimeAsync(1100); });
    expect(document.body.textContent).toContain("Renseignez les informations demandées");
    expect(replay.mock.calls[replay.mock.calls.length - 1]?.[0].gesture).not.toBe(previousGesture);
    expect(document.querySelector("iframe")).toBe(frame);
    expect(avatar.getAttribute("aria-expanded")).toBe("false");
  });
  it("conserve le personnage et son iframe lors du remplacement d’une étape", async () => {
    vi.useFakeTimers();
    act(() => root.render(<AuthChatbotProvider><section><AuthOnboardingChatbot key="activation" introduction={false} message="Activez votre compte." /></section></AuthChatbotProvider>));
    await act(async () => { await vi.advanceTimersByTimeAsync(50); });
    const actor = document.querySelector('[aria-label="Chatbot ANDRIA"]');
    const frame = actor?.querySelector("iframe");
    expect(frame).not.toBeNull();
    act(() => root.render(<AuthChatbotProvider><section><AuthOnboardingChatbot key="profil" introduction={false} message="Complétez votre profil." /></section></AuthChatbotProvider>));
    await act(async () => { await vi.advanceTimersByTimeAsync(50); });
    expect(document.querySelector('[aria-label="Chatbot ANDRIA"]')).toBe(actor);
    expect(actor?.querySelector("iframe")).toBe(frame);
    expect(document.querySelector('[data-chatbot-bubble]')?.textContent).toBe("Complétez votre profil.");
  });

});
