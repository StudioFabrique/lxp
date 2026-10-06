import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AuthPageWrapper from "./AuthPageWrapper";

describe("dialogue des étapes de configuration", () => {
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
    vi.restoreAllMocks();
  });

  it("présente la description dans une bulle reliée au chatbot", () => {
    act(() => root.render(<AuthPageWrapper variant="setup" title="Activer le compte root" description="Cette clé sécurise votre instance."><input aria-label="Clé" /></AuthPageWrapper>));
    expect(container.querySelector("h1")?.textContent).toBe("Activer le compte root");
    expect(container.querySelector("p")).toBeNull();
    const bubble = document.querySelector("[data-chatbot-bubble]");
    expect(bubble?.textContent).toBe("Cette clé sécurise votre instance.");
    expect(bubble?.querySelector('[aria-hidden="true"]')).not.toBeNull();
    expect(document.querySelector('iframe[title="Salut animé du chatbot ANDRIA"]')).not.toBeNull();
    expect(container.querySelector('[data-chatbot-placement="page"]')).toBeNull();
    expect(document.querySelector('[data-chatbot-placement="page"]')?.parentElement).toBe(document.body);
    expect(container.querySelector('input[aria-label="Clé"]')).not.toBeNull();
  });

  it("conserve la description des pages de connexion classiques", () => {
    act(() => root.render(<AuthPageWrapper title="Connexion" description="Accédez à votre espace." />));
    expect(container.querySelector("p")?.textContent).toBe("Accédez à votre espace.");
    expect(container.querySelector("iframe")).toBeNull();
  });

  it("conserve le personnage pendant la saisie et renouvelle son apparition au message suivant", () => {
    act(() => root.render(<AuthPageWrapper variant="setup" title="Votre étape" description="Premier message" />));
    const frame = document.querySelector("iframe");
    act(() => root.render(<AuthPageWrapper variant="setup" title="Votre étape" description="Premier message"><input /></AuthPageWrapper>));
    expect(document.querySelector("iframe")).toBe(frame);
    act(() => root.render(<AuthPageWrapper variant="setup" title="Étape suivante" description="Message suivant" />));
    expect(document.querySelector("iframe")).not.toBe(frame);
    expect(document.body.textContent).toContain("Message suivant");
  });
});
