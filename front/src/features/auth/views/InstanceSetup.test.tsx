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
      roleLabels: { "1": "Administrateur", "2": "Équipe pédagogique", "3": "Apprenant", "4": "Visiteur" },
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

    await goToRoles();
    await submit();

    const payload = vi.mocked(profileApi.mutations.updateInstanceSettings).mock.calls[0]?.[0];
    expect(payload?.get("website")).toBe("https://step.eco");
    expect(payload?.get("color")).toBe("#ffffff");
  });

  async function nextStep(): Promise<void> {
    await act(async () => {
      Array.from(container.querySelectorAll("button")).find((button) => button.textContent === "Continuer")?.click();
    });
  }

  /** Étape 2 (identité) vers étape 3 (libellés des rôles) : le formulaire de l'étape 2 est validé puis on avance. */
  async function goToRoles(): Promise<void> {
    await act(async () => container.querySelector("form")?.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    ));
  }

  function roleInput(name: string): HTMLInputElement {
    const input = container.querySelector<HTMLInputElement>(`input[name="roleLabels.${name}"]`);
    expect(input).not.toBeNull();
    return input as HTMLInputElement;
  }

  async function typeInto(input: HTMLInputElement, value: string): Promise<void> {
    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, value);
      input.dispatchEvent(new Event("input", { bubbles: true }));
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

  /** Depuis l'étape 2, passe à l'étape des rôles puis enregistre. */
  async function finish(): Promise<void> {
    await goToRoles();
    await submit();
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
    await finish();
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
    await finish();
    expect(vi.mocked(profileApi.mutations.updateInstanceSettings).mock.calls[0]?.[0].get("emailTemplate")).toBe("soft");
  });

  it("conserve le modèle choisi après une erreur serveur pour permettre une nouvelle tentative", async () => {
    await nextStep();
    await clickButton("Modifier le template");
    await clickButton("Éditorial");
    await clickButton("Appliquer le template");
    vi.mocked(profileApi.mutations.updateInstanceSettings).mockRejectedValueOnce(new Error("indisponible"));
    await finish();
    expect(toast.error).toHaveBeenCalled();
    await clickButton("Précédent");
    expect(container.textContent).toContain("Modèle sélectionné : Éditorial");
    await finish();
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
    expect(container.textContent).not.toContain("Nommez les rôles");
    expect(profileApi.mutations.updateInstanceSettings).not.toHaveBeenCalled();
  });

  it("propose les libellés de rôles par défaut et les envoie à l'enregistrement", async () => {
    await nextStep();
    await goToRoles();
    expect(container.textContent).toContain("Nommez les rôles");
    expect(roleInput("admin").value).toBe("Administrateur");
    expect(roleInput("team").value).toBe("Équipe pédagogique");
    expect(roleInput("student").value).toBe("Apprenant");
    expect(roleInput("visitor").value).toBe("Visiteur");

    expect(container.textContent).toContain("Aperçu dans l’application");
    expect(container.textContent).toContain("Aucun membre « Équipe pédagogique » renseigné");

    await typeInto(roleInput("team"), "  Ressources   pédagogiques ");
    // L'aperçu suit la saisie, espaces superflus compris tant qu'elle n'est pas normalisée.
    expect(container.textContent).toContain("Aucun membre « Ressources   pédagogiques » renseigné");
    await submit();

    const payload = vi.mocked(profileApi.mutations.updateInstanceSettings).mock.calls[0]?.[0];
    expect(JSON.parse(String(payload?.get("roleLabels")))).toEqual({
      "1": "Administrateur",
      "2": "Ressources pédagogiques",
      "3": "Apprenant",
      "4": "Visiteur",
    });
  });

  it("bloque l'enregistrement d'un libellé vide ou en doublon", async () => {
    await nextStep();
    await goToRoles();

    await typeInto(roleInput("team"), " ");
    await submit();
    expect(roleInput("team").getAttribute("aria-invalid")).toBe("true");
    expect(profileApi.mutations.updateInstanceSettings).not.toHaveBeenCalled();

    await typeInto(roleInput("team"), "apprenant");
    await submit();
    expect(container.textContent).toContain("Chaque rôle doit porter un libellé différent.");
    expect(profileApi.mutations.updateInstanceSettings).not.toHaveBeenCalled();
  });

  it("reprend les libellés déjà enregistrés par l'instance", async () => {
    vi.mocked(profileApi.queries.getInstanceSettings).mockResolvedValue({
      name: "ANDRIA",
      website: "",
      setupCompleted: false,
      hasLogo: false,
      enabledThemes: ["classic", "classic-dark"],
      emailTemplate: "minimal",
      roleLabels: { "2": "Formateurs" },
    });
    await act(async () => root.unmount());
    root = createRoot(container);
    await act(async () => root.render(
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
        <InstanceSetup />
      </QueryClientProvider>,
    ));
    await nextStep();
    await goToRoles();
    expect(roleInput("team").value).toBe("Formateurs");
    expect(roleInput("admin").value).toBe("Administrateur");
  });

});
