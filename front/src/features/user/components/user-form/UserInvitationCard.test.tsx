import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import UserInvitationCard from "./UserInvitationCard";

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe("UserInvitationCard", () => {
  let root: Root;
  let container: HTMLDivElement;
  afterEach(() => {
    act(() => root?.unmount());
    container?.remove();
  });

  const renderCard = (sendEmail: boolean, disabled = false) => {
    const onChange = vi.fn();
    container = document.createElement("div");
    document.body.append(container);
    act(() => {
      root = createRoot(container);
      root.render(<UserInvitationCard sendEmail={sendEmail} onSetSendEmail={onChange} disabled={disabled} />);
    });
    return onChange;
  };

  it("présente le choix d'inviter plus tard et permet d'activer l'envoi", () => {
    const onChange = renderCard(false);
    const toggle = container.querySelector<HTMLInputElement>('[role="switch"]');
    expect(toggle?.checked).toBe(false);
    expect(container.textContent).toContain("Inviter par email");
    expect(container.textContent).toContain("Invitation à envoyer plus tard");
    expect(container.querySelector("label")?.htmlFor).toBe(toggle?.id);
    expect(toggle?.getAttribute("aria-describedby")).toBe(`${toggle?.id}-description`);
    act(() => toggle?.click());
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("annonce un envoi futur et permet de le désactiver", () => {
    const onChange = renderCard(true);
    expect(container.textContent).toContain("Invitation prévue à la création");
    expect(container.textContent).toContain("un email lui permettra de choisir son mot de passe");
    expect(container.querySelector("svg")?.classList.contains("lucide-send")).toBe(true);
    act(() => container.querySelector<HTMLInputElement>('[role="switch"]')?.click());
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("empêche la modification pendant l'enregistrement", () => {
    const onChange = renderCard(true, true);
    const toggle = container.querySelector<HTMLInputElement>('[role="switch"]');
    expect(toggle?.disabled).toBe(true);
    act(() => toggle?.click());
    expect(onChange).not.toHaveBeenCalled();
  });
});
