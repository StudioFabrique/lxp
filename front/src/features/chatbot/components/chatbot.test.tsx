import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Chatbot from "./chatbot";
import { ChatbotProvider } from "../../../store/ChatbotProvider";
import { DEFAULT_DEMO_CONFIG, DemoContext } from "../../../store/DemoContext";
import { chatbotApi } from "../api/chatbot.api";

vi.mock("../api/chatbot.api", () => ({
  chatbotApi: {
    queries: { getDialogs: vi.fn() },
    mutations: { sendPrompt: vi.fn() },
  },
}));

const avatarLabel = "Afficher les questions d’aide de l’assistant virtuel ANDRIA";
const menu = (): HTMLElement | null => document.querySelector('ul[aria-label="Questions pour l’assistant virtuel"]');
const menuLabels = (): string[] => Array.from(menu()?.querySelectorAll("li") ?? [], (item) => item.textContent ?? "");
const bubble = (): string => document.querySelector("[data-chatbot-bubble]")?.textContent ?? "";
const findButton = (label: string): HTMLButtonElement => {
  const button = Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find((entry) => entry.textContent?.trim() === label || entry.getAttribute("aria-label") === label);
  if (!button) throw new Error(`Bouton introuvable : ${label}`);
  return button;
};

/** Laisse l'éventail finir son animation de sortie avant de vérifier qu'il a disparu. */
const settle = (): Promise<void> => act(async () => { await new Promise((resolve) => setTimeout(resolve, 300)); });

describe("assistant virtuel de l'application", () => {
  let container: HTMLDivElement;
  let root: Root;

  const render = async (aiDisabled: boolean): Promise<void> => {
    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={["/admin/dashboard"]}>
          <DemoContext value={{ ...DEFAULT_DEMO_CONFIG, aiDisabled, isConfigLoaded: true }}>
            <ChatbotProvider>
              <Chatbot />
            </ChatbotProvider>
          </DemoContext>
        </MemoryRouter>,
      );
    });
  };

  beforeEach(() => {
    window.localStorage.clear();
    vi.mocked(chatbotApi.queries.getDialogs).mockResolvedValue({ success: true, dialogs: [] });
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    document.body.innerHTML = "";
    vi.clearAllMocks();
  });

  it("garde l'assistant sans IA : aucun appel au serveur IA, seulement les tutoriels de l'interface", async () => {
    await render(true);
    expect(chatbotApi.queries.getDialogs).not.toHaveBeenCalled();
    act(() => document.querySelector<HTMLButtonElement>(`button[aria-label="${avatarLabel}"]`)?.click());
    expect(menuLabels()).toEqual(["À quoi sert cette page ?", "À quoi servent les menus ?"]);
    expect(menu()?.querySelector("input")).toBeNull();
  });

  it("propose en éventail la question libre, ses accès à l'historique et les tutoriels quand l'IA est active", async () => {
    await render(false);
    expect(chatbotApi.queries.getDialogs).toHaveBeenCalledTimes(1);
    act(() => document.querySelector<HTMLButtonElement>(`button[aria-label="${avatarLabel}"]`)?.click());
    // La première entrée est la question libre : son libellé n'est lu que par les lecteurs d'écran.
    expect(menuLabels()).toEqual(["Poser une question à l’assistant virtuel", "À quoi sert cette page ?", "À quoi servent les menus ?"]);
  });

  it("n'appelle pas l'IA pour une question vide et signale l'erreur près du champ", async () => {
    await render(false);
    act(() => document.querySelector<HTMLButtonElement>(`button[aria-label="${avatarLabel}"]`)?.click());
    await act(async () => { findButton("Envoyer la question").click(); });
    expect(menu()?.querySelector('[role="alert"]')?.textContent).toBe("Saisissez votre question.");
    expect(menu()?.querySelector("input")?.getAttribute("aria-invalid")).toBe("true");
    expect(chatbotApi.mutations.sendPrompt).not.toHaveBeenCalled();
  });

  it("envoie la question libre et affiche la réponse à gauche de l'assistant, avec de quoi l'agrandir", async () => {
    vi.mocked(chatbotApi.mutations.sendPrompt).mockResolvedValue({ text: "Voici la **réponse**.", type: "normal" });
    await render(false);
    act(() => document.querySelector<HTMLButtonElement>(`button[aria-label="${avatarLabel}"]`)?.click());
    const input = menu()?.querySelector<HTMLInputElement>("input");
    if (!input) throw new Error("champ de question introuvable");
    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, "  Comment réviser ?  ");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await act(async () => { findButton("Envoyer la question").click(); });
    expect(chatbotApi.mutations.sendPrompt).toHaveBeenCalledWith(expect.objectContaining({ prompt: "Comment réviser ?" }));
    expect(bubble()).toContain("Voici la réponse.");
    await settle();
    expect(menu()).toBeNull();
    expect(findButton("Agrandir la réponse dans la fenêtre de conversation")).toBeDefined();
    await act(async () => { findButton("Fermer la réponse").click(); });
    expect(document.querySelector("[data-chatbot-bubble]")).toBeNull();
  });

  it("ouvre la fenêtre de conversation complète depuis l'historique", async () => {
    await render(false);
    act(() => document.querySelector<HTMLButtonElement>(`button[aria-label="${avatarLabel}"]`)?.click());
    await act(async () => { findButton("Afficher l’historique de la conversation").click(); });
    expect(document.body.textContent).toContain("Assistant virtuel ANDRIA");
    expect(document.querySelector('[aria-label="Changer la taille"]') ?? document.querySelector('[aria-label="Fermer l’assistant virtuel"]')).not.toBeNull();
  });

  describe("tutoriel guidé", () => {
    const addSidebar = (): HTMLElement[] => {
      document.body.insertAdjacentHTML("beforeend", '<aside><a href="/admin/dashboard">Accueil</a><a href="/admin/parcours">Parcours</a></aside>');
      const links = Array.from(document.querySelectorAll<HTMLElement>("aside a"));
      links.forEach((link, index) => {
        link.getBoundingClientRect = () => new DOMRect(8, 100 + index * 40, 200, 32);
        link.scrollIntoView = vi.fn();
      });
      return links;
    };

    it("déplace l'assistant d'étape en étape, désigne l'élément expliqué et s'arrête sur demande", async () => {
      const links = addSidebar();
      await render(true);
      act(() => document.querySelector<HTMLButtonElement>(`button[aria-label="${avatarLabel}"]`)?.click());
      await act(async () => { findButton("À quoi servent les menus ?").click(); });
      await settle();
      expect(menu()).toBeNull();
      expect(bubble()).toContain("Accueil.");
      expect(bubble()).toContain("1 / 2");
      expect(links[0].scrollIntoView).toHaveBeenCalled();
      await act(async () => { findButton("Suivant").click(); });
      expect(bubble()).toContain("Parcours.");
      expect(bubble()).toContain("2 / 2");
      await act(async () => { findButton("Précédent").click(); });
      expect(bubble()).toContain("1 / 2");
      await act(async () => { window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" })); });
      expect(document.querySelector("[data-chatbot-bubble]")).toBeNull();
    });

    it("annonce qu'il n'y a rien à montrer quand aucun élément n'est affiché", async () => {
      await render(true);
      act(() => document.querySelector<HTMLButtonElement>(`button[aria-label="${avatarLabel}"]`)?.click());
      await act(async () => { findButton("À quoi servent les menus ?").click(); });
      expect(bubble()).toContain("rien à vous montrer");
      await act(async () => { findButton("Terminer").click(); });
      expect(document.querySelector("[data-chatbot-bubble]")).toBeNull();
    });
  });
});
