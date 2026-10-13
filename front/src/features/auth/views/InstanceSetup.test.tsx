import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { profileApi } from "../../profile/api/profile.api";
import InstanceSetup from "./InstanceSetup";

vi.mock("react-router", () => ({ useNavigate: () => vi.fn() }));
vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("../../profile/api/profile.api", () => ({
  profileApi: {
    queries: { getInstanceSettings: vi.fn() },
    mutations: { updateInstanceSettings: vi.fn() },
  },
}));
vi.mock("../../../components/UI/image-file-upload/image-file-upload", () => ({
  default: ({ previewBackgroundColor }: { previewBackgroundColor: string }) => (
    <div data-testid="logo-preview" data-background={previewBackgroundColor} />
  ),
}));
vi.mock("../components/AuthPageWrapper", () => ({
  default: ({ children, title }: { children: React.ReactNode; title: React.ReactNode }) => <div>{title}{children}</div>,
}));
vi.mock("../../../components/UI/OnboardingProgressPanel", () => ({
  default: ({ children, footer }: { children: React.ReactNode; footer?: React.ReactNode }) => <div>{children}{footer}</div>,
}));

describe("Personnalisez votre espace", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(async () => {
    vi.mocked(profileApi.queries.getInstanceSettings).mockResolvedValue({
      name: "ANDRIA",
      website: "https://step.eco",
      setupCompleted: false,
      hasLogo: false,
      enabledThemes: ["classic", "classic-dark"],
      emailTemplate: "minimal",
    });
    vi.mocked(profileApi.mutations.updateInstanceSettings).mockResolvedValue({
      name: "ANDRIA",
      website: "",
      setupCompleted: true,
      hasLogo: false,
      enabledThemes: ["classic", "classic-dark"],
      emailTemplate: "minimal",
    });

    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    await act(async () => root.render(
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}>
        <InstanceSetup />
      </QueryClientProvider>,
    ));
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.clearAllMocks();
  });

  it("enregistre le site internet de l’organisme", async () => {
    expect(container.textContent).not.toContain("Continuer avec ANDRIA");
    expect(container.textContent).toContain("Choisissez votre thème");

    await act(async () => {
      Array.from(container.querySelectorAll("button")).find((button) => button.textContent === "Continuer")?.click();
    });
    expect(container.textContent).toContain("Personnalisez votre espace");

    await act(async () => {
      container.querySelector("form")?.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true }),
      );
    });

    const payload = vi.mocked(profileApi.mutations.updateInstanceSettings).mock.calls[0]?.[0];
    expect(payload?.get("website")).toBe("https://step.eco");
    expect(payload?.get("color")).toBe("#ffffff");
  });

  async function nextStep(): Promise<void> {
    await act(async () => {
      Array.from(container.querySelectorAll("button")).find((button) => button.textContent === "Continuer")?.click();
    });
  }

  async function clickButton(label: string): Promise<void> {
    const button = Array.from(document.querySelectorAll("button")).find((item) => (item.getAttribute("aria-label") ?? item.textContent?.trim()) === label);
    expect(button).toBeDefined();
    await act(async () => button?.click());
  }

  async function submit(): Promise<void> {
    await act(async () => container.querySelector("form")?.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    ));
  }

  it("applique le modèle au formulaire sans terminer la configuration", async () => {
    await nextStep();
    expect(container.textContent).toContain("Modèle sélectionné : Classique");
    expect(container.textContent).not.toContain("Envoyer un e-mail de test");
    await clickButton("Modifier le template");
    const modal = document.querySelector("dialog");
    expect(modal).not.toBeNull();
    expect(container.contains(modal)).toBe(false);
    expect(modal?.querySelectorAll("button[aria-pressed]")).toHaveLength(6);
    await clickButton("Bannière");
    await clickButton("Appliquer le template");
    expect(document.querySelector("dialog")).toBeNull();
    expect(container.textContent).toContain("Modèle sélectionné : Bannière");
    expect(profileApi.mutations.updateInstanceSettings).not.toHaveBeenCalled();
    await submit();
    expect(vi.mocked(profileApi.mutations.updateInstanceSettings).mock.calls[0]?.[0].get("emailTemplate")).toBe("contrast");
  });

  it("annule le brouillon et conserve le choix pendant un retour à l’étape précédente", async () => {
    await nextStep();
    await clickButton("Modifier le template");
    await clickButton("Invitation");
    await clickButton("Appliquer le template");
    await clickButton("Modifier le template");
    await clickButton("Bannière");
    await clickButton("Annuler");
    await clickButton("Précédent");
    await nextStep();
    expect(container.textContent).toContain("Modèle sélectionné : Invitation");
    await clickButton("Modifier le template");
    expect(document.querySelector('button[aria-pressed="true"]')?.textContent).toContain("Invitation");
    await clickButton("Annuler");
    await submit();
    expect(vi.mocked(profileApi.mutations.updateInstanceSettings).mock.calls[0]?.[0].get("emailTemplate")).toBe("soft");
  });

  it("conserve le modèle choisi après une erreur serveur pour permettre une nouvelle tentative", async () => {
    await nextStep();
    await clickButton("Modifier le template");
    await clickButton("Éditorial");
    await clickButton("Appliquer le template");
    vi.mocked(profileApi.mutations.updateInstanceSettings).mockRejectedValueOnce(new Error("indisponible"));
    await submit();
    expect(toast.error).toHaveBeenCalled();
    expect(container.textContent).toContain("Modèle sélectionné : Éditorial");
    await submit();
    expect(profileApi.mutations.updateInstanceSettings).toHaveBeenCalledTimes(2);
    expect(vi.mocked(profileApi.mutations.updateInstanceSettings).mock.calls[1]?.[0].get("emailTemplate")).toBe("editorial");
  });

  it("bloque l’enregistrement quand le site optionnel renseigné est invalide", async () => {
    await nextStep();
    const input = container.querySelector<HTMLInputElement>('input[inputmode="url"]');
    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, "invalide");
      input?.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await submit();
    expect(input?.getAttribute("aria-invalid")).toBe("true");
    expect(profileApi.mutations.updateInstanceSettings).not.toHaveBeenCalled();
  });

});
