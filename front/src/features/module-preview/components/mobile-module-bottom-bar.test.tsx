import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import MobileModuleBottomBar from "./mobile-module-bottom-bar";
import { onChatbotQuestionsCloseRequest, publishChatbotDock } from "../../chatbot/chatbot-dock-store";
import MobileActivityNavigation from "./preview/mobile-activity-navigation";

const roots: Root[] = [];

const render = (node: React.ReactNode) => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  roots.push(root);
  act(() => root.render(node));
  return container;
};

afterEach(() => {
  roots.splice(0).forEach((root) => act(() => root.unmount()));
  document.body.innerHTML = "";
});

describe("MobileModuleBottomBar", () => {
  it("ouvre la liste des cours et expose sa zone pour les boutons précédent / suivant", () => {
    const onOpenNavigation = vi.fn();
    const onSlot = vi.fn();
    const container = render(
      <MobileModuleBottomBar onOpenNavigation={onOpenNavigation} onNavigationSlotChange={onSlot} />,
    );

    act(() =>
      container
        .querySelector<HTMLButtonElement>('button[aria-label="Ouvrir la navigation du module"]')!
        .click(),
    );

    expect(onOpenNavigation).toHaveBeenCalledOnce();
    expect(onSlot).toHaveBeenCalledWith(expect.any(HTMLElement));
    expect(container.firstElementChild?.className).toContain("md:hidden");
    // Un vrai bouton, nommé, pas une simple icône.
    expect(container.textContent).toContain("Sommaire");
    expect(container.firstElementChild?.className).toContain("fixed");
  });
});

describe("MobileModuleBottomBar réduite", () => {
  afterEach(() => publishChatbotDock({ questionsOpen: false, visible: false, viewportWidth: 0 }));

  it("ne fait que refermer les questions de l'assistant, sans ouvrir la navigation", () => {
    publishChatbotDock({ questionsOpen: true, viewportWidth: 400, viewportHeight: 800 });
    const onOpenNavigation = vi.fn();
    const onCloseRequest = vi.fn();
    const stop = onChatbotQuestionsCloseRequest(onCloseRequest);
    const container = render(
      <MobileModuleBottomBar onOpenNavigation={onOpenNavigation} onNavigationSlotChange={vi.fn()} />,
    );

    act(() =>
      container.querySelector<HTMLButtonElement>('button[aria-label="Revenir à l\'affichage normal"]')!.click(),
    );

    expect(onCloseRequest).toHaveBeenCalledOnce();
    expect(onOpenNavigation).not.toHaveBeenCalled();
    stop();
  });

  it("ne rouvre pas la navigation quand l'appui a déjà refermé les questions avant le clic", () => {
    publishChatbotDock({ questionsOpen: true, viewportWidth: 400, viewportHeight: 800 });
    const onOpenNavigation = vi.fn();
    const container = render(
      <MobileModuleBottomBar onOpenNavigation={onOpenNavigation} onNavigationSlotChange={vi.fn()} />,
    );
    const button = container.querySelector<HTMLButtonElement>("button")!;

    // L'appui referme les questions (la barre reprend sa forme normale), puis le clic arrive.
    act(() => {
      button.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
      publishChatbotDock({ questionsOpen: false });
    });
    act(() => button.click());

    expect(onOpenNavigation).not.toHaveBeenCalled();
  });
});

describe("MobileActivityNavigation", () => {
  const next = { label: "Activité suivante", onClick: vi.fn() };

  it("enchaîne les activités avec précédent / suivant", () => {
    const onPreviousActivity = vi.fn();
    const container = render(
      <MobileActivityNavigation isFirstActivitySelected={false} next={next} onPreviousActivity={onPreviousActivity} />,
    );

    act(() => container.querySelector<HTMLButtonElement>('button[aria-label="Activité précédente"]')!.click());
    act(() => container.querySelector<HTMLButtonElement>('button[aria-label="Activité suivante"]')!.click());

    expect(onPreviousActivity).toHaveBeenCalledOnce();
    expect(next.onClick).toHaveBeenCalledOnce();
  });

  it("désactive précédent sur la première activité et masque suivant quand il n'y a plus rien après", () => {
    const container = render(
      <MobileActivityNavigation isFirstActivitySelected next={null} onPreviousActivity={vi.fn()} />,
    );
    const [previous, following] = Array.from(container.querySelectorAll("button"));

    expect(previous.disabled).toBe(true);
    expect(following.disabled).toBe(true);
    expect(following.className).toContain("invisible");
  });

  it("désactive suivant quand l'action est verrouillée", () => {
    const container = render(
      <MobileActivityNavigation
        isFirstActivitySelected={false}
        next={{ label: "Marquer la leçon comme terminée", disabled: true, onClick: vi.fn() }}
        onPreviousActivity={vi.fn()}
      />,
    );

    expect(
      container.querySelector<HTMLButtonElement>('button[aria-label="Marquer la leçon comme terminée"]')?.disabled,
    ).toBe(true);
  });
});
