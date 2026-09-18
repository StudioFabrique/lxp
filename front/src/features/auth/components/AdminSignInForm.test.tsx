import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { onboardingApi } from "../api/onboarding.api";
import AdminSignInForm from "./AdminSignInForm";
import { getPendingRootActivationEmail } from "../pending-root-activation";

vi.mock("../api/onboarding.api", () => ({
  onboardingApi: {
    createFirstAdmin: vi.fn(),
    createRootAccount: vi.fn(),
  },
}));

describe("AdminSignInForm", () => {
  let container: HTMLDivElement;
  let root: Root;
  const onSuccess = vi.fn();

  beforeEach(async () => {
    localStorage.clear();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    vi.mocked(onboardingApi.createFirstAdmin).mockResolvedValue({
      success: true,
      pendingActivation: true,
      message: "Un lien d'activation a été envoyé.",
    });

    await act(async () => {
      root.render(
        <AdminSignInForm
          token="setup-token"
          onSuccess={onSuccess}
          onRestart={onSuccess}
        />,
      );
    });
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.clearAllMocks();
  });

  const fillInput = async (placeholder: string, value: string) => {
    const input = container.querySelector<HTMLInputElement>(
      `input[placeholder="${placeholder}"]`,
    );
    await act(async () => {
      const valueSetter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      )?.set;
      valueSetter?.call(input, value);
      input?.dispatchEvent(new Event("input", { bubbles: true }));
    });
  };

  it("attend l'activation par email après la création du premier root", async () => {
    expect(container.querySelector(".tooltip")?.getAttribute("data-tip")).toContain(
      "Un seul utilisateur peut être root",
    );
    await fillInput("Adresse email", "root@test.fr");
    await fillInput("Prénom", "Root");
    await fillInput("Nom", "Admin");
    await fillInput("Mot de passe", "RootPassword@123");
    await fillInput("Confirmer le mot de passe", "RootPassword@123");

    await act(async () => {
      container
        .querySelector<HTMLFormElement>("form")
        ?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });

    expect(onboardingApi.createFirstAdmin).toHaveBeenCalledWith({
      token: "setup-token",
      email: "root@test.fr",
      firstname: "Root",
      lastname: "Admin",
      password: "RootPassword@123",
    });
    expect(onSuccess).not.toHaveBeenCalled();
    expect(getPendingRootActivationEmail()).toBe("root@test.fr");
    expect(container.textContent).toContain("Vérifiez votre boîte mail");
    expect(container.textContent).toContain("root@test.fr");

    await act(async () => {
      Array.from(container.querySelectorAll("button"))
        .find((button) =>
          button.textContent?.includes("Recommencer la création"),
        )
        ?.click();
    });
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(getPendingRootActivationEmail()).toBe("");
  });

  it("explique la rétrogradation du root actuel avant une nouvelle création", async () => {
    await act(async () => {
      root.render(<AdminSignInForm token="root-token" mode="additional" onSuccess={onSuccess} />);
    });
    const tooltip = container.querySelector(".tooltip");
    expect(tooltip?.getAttribute("data-tip")).toContain("L’utilisateur root actuel");
    expect(tooltip?.getAttribute("data-tip")).toContain(
      "administrateur et perdra ses droits root",
    );
    expect(onboardingApi.createRootAccount).not.toHaveBeenCalled();
  });
});
