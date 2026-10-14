import { act, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import DropoutPreferencesForm from "./DropoutPreferencesForm";
import OnboardingProgressPanel from "../../../components/UI/OnboardingProgressPanel";

const update = vi.hoisted(() => vi.fn());
const createGroup = vi.hoisted(() => vi.fn());
const getStudentGroups = vi.hoisted(() => vi.fn());
const getById = vi.hoisted(() => vi.fn());
vi.mock("../api/dashboardIA.api", () => ({ dashboardIAApi: { updateDropoutPreferences: update } }));
vi.mock("../../group/api/group.api", () => ({ groupApi: { queries: { getStudentGroups, getById, getStudents: vi.fn().mockResolvedValue({ list: [], total: 0 }) }, mutations: { create: createGroup } } }));
vi.mock("../../dashboard-admin/api/dashboard-admin.api", () => ({ dashboardAdminApi: { queries: { getRootParcours: vi.fn().mockResolvedValue([]) } } }));

describe("préférences d'analyse du décrochage", () => {
  let root: Root;
  let container: HTMLDivElement;
  beforeEach(() => {
    Object.defineProperty(HTMLDialogElement.prototype, "showModal", { configurable: true, value: function (this: HTMLDialogElement) { this.setAttribute("open", ""); } });
    Object.defineProperty(HTMLDialogElement.prototype, "close", { configurable: true, value: function (this: HTMLDialogElement) { this.removeAttribute("open"); } });
    update.mockReset().mockResolvedValue({ enabled: false, frequency: "weekly", hasParcours: true, onboardingRequired: false });
    getStudentGroups.mockReset().mockResolvedValue([]);
    getById.mockReset();
    createGroup.mockReset().mockResolvedValue(undefined);
    container = document.createElement("div"); document.body.appendChild(container);
    root = createRoot(container);
  });

  it("crée le groupe dans une modale sans terminer l’accueil", async () => {
    const onSaved = vi.fn();
    await act(async () => root.render(<QueryClientProvider client={new QueryClient()}>
      <DropoutPreferencesForm initial={{ enabled: false, frequency: "weekly", hasParcours: true, onboardingRequired: true }} onSaved={onSaved} completeOnboarding={false} />
    </QueryClientProvider>));
    await act(async () => container.querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"]')!.click());
    const input = document.querySelector<HTMLInputElement>(`input[placeholder="Ex. Promotion ${new Date().getFullYear()}"]`)!;
    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, "Promotion test");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await act(async () => document.querySelector<HTMLButtonElement>('dialog button[type="submit"]')!.click());
    expect(createGroup).toHaveBeenCalledOnce();
    expect(JSON.parse((createGroup.mock.calls[0][0] as FormData).get("data") as string).group.name).toBe("Promotion test");
    expect(update).not.toHaveBeenCalled();
    expect(onSaved).not.toHaveBeenCalled();
    expect(document.querySelector("dialog")).toBeNull();
    await act(async () => container.querySelector<HTMLButtonElement>('button[type="submit"]')!.click());
    expect(createGroup).toHaveBeenCalledOnce();
    expect(onSaved).toHaveBeenCalledOnce();
  });

  it("termine l’accueil sans ouvrir la création de groupe", async () => {
    await act(async () => root.render(<QueryClientProvider client={new QueryClient()}>
      <DropoutPreferencesForm initial={{ enabled: false, frequency: "weekly", hasParcours: true, onboardingRequired: true }} onSaved={vi.fn()} completeOnboarding={false} />
    </QueryClientProvider>));
    expect(container.querySelectorAll('input[type="checkbox"]')).toHaveLength(1);
    await act(async () => container.querySelector<HTMLButtonElement>('button[type="submit"]')!.click());
    expect(createGroup).not.toHaveBeenCalled();
    expect(update).toHaveBeenCalledWith(expect.objectContaining({ completeOnboarding: true }));
  });
  it("affiche les groupes accessibles et charge leurs apprenants au clic", async () => {
    getStudentGroups.mockResolvedValue([{ _id: "group-1", name: "Promotion existante", nbStudents: 1, formation: "Parcours test" }]);
    getById.mockResolvedValue({ users: [{ _id: "student-1", firstname: "Alice", lastname: "Martin" }] });
    await act(async () => root.render(<QueryClientProvider client={new QueryClient()}>
      <DropoutPreferencesForm initial={{ enabled: false, frequency: "weekly", hasParcours: true, onboardingRequired: true }} onSaved={vi.fn()} completeOnboarding={false} />
    </QueryClientProvider>));
    await act(async () => { await new Promise((resolve) => setTimeout(resolve, 20)); });
    expect(container.textContent).toContain("Promotion existante");
    expect(container.textContent).toContain("1 apprenant");
    expect(container.textContent).not.toContain("Parcours test");
    expect(container.textContent).toContain("Créer un nouveau groupe");
    expect(container.querySelectorAll('input[type="checkbox"]')).toHaveLength(1);
    expect(getById).not.toHaveBeenCalled();
    const groupButton = container.querySelector<HTMLButtonElement>('button[aria-label="Voir les apprenants de Promotion existante"]')!;
    await act(async () => groupButton.click());
    await act(async () => { await new Promise((resolve) => setTimeout(resolve, 20)); });
    expect(getById).toHaveBeenCalledWith("group-1");
    expect(document.body.textContent).toContain("Alice Martin");
    await act(async () => document.querySelector<HTMLButtonElement>('button[aria-label="Retour"]')!.click());
    expect(document.body.textContent).not.toContain("Alice Martin");
    expect(update).not.toHaveBeenCalled();
  });

  it("garde les actions hors du formulaire défilant et permet de terminer", async () => {
    const footer = document.createElement("div");
    document.body.appendChild(footer);
    try {
      await act(async () => root.render(<QueryClientProvider client={new QueryClient()}>
        <DropoutPreferencesForm initial={{ enabled: false, frequency: "weekly", hasParcours: true, onboardingRequired: true }}
          onSaved={vi.fn()} onBack={vi.fn()} completeOnboarding={false} footerContainer={footer} submitLabel="Terminer" />
      </QueryClientProvider>));
      expect(container.querySelector('button[type="submit"]')).toBeNull();
      expect(footer.textContent).toContain("Précédent");
      await act(async () => footer.querySelector<HTMLButtonElement>('button[type="submit"]')!.click());
      expect(update).toHaveBeenCalledOnce();
    } finally { footer.remove(); }
  });

  it("retire les anciennes actions dès le retour à l’étape précédente", async () => {
    function Onboarding() {
      const [step, setStep] = useState(2);
      const [footer, setFooter] = useState<HTMLDivElement | null>(null);
      return (
        <OnboardingProgressPanel
          contentKey={String(step)} currentStep={step} stepCount={2}
          progressLabel="Progression"
          footer={step === 2 ? <div ref={setFooter} /> : <div><button>Précédent</button><button>Continuer</button></div>}
        >
          {step === 2 ? (
            <DropoutPreferencesForm
              initial={{ enabled: false, frequency: "weekly", hasParcours: true, onboardingRequired: true }}
              onSaved={vi.fn()} onBack={() => setStep(1)}
              completeOnboarding={false} footerContainer={footer} submitLabel="Terminer"
            />
          ) : <p>Apparence</p>}
        </OnboardingProgressPanel>
      );
    }
    await act(async () => root.render(
      <QueryClientProvider client={new QueryClient()}><Onboarding /></QueryClientProvider>,
    ));
    await act(async () => Array.from(container.querySelectorAll("button")).find((button) => button.textContent === "Précédent")!.click());
    // The old form still exists during its exit animation, but its actions must disappear.
    expect(container.querySelector("form")).not.toBeNull();
    expect(Array.from(container.querySelectorAll("button")).filter((button) => button.textContent === "Précédent")).toHaveLength(1);
    expect(container.textContent).not.toContain("Terminer");
    expect(container.textContent).toContain("Continuer");
    expect(update).not.toHaveBeenCalled();
  });

  it("superpose le choix des apprenants sans l’imbriquer dans le formulaire de création", async () => {
    await act(async () => root.render(<QueryClientProvider client={new QueryClient()}>
      <DropoutPreferencesForm initial={{ enabled: false, frequency: "weekly", hasParcours: true, onboardingRequired: true }} onSaved={vi.fn()} completeOnboarding={false} />
    </QueryClientProvider>));
    await act(async () => container.querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"]')!.click());
    const dialog = document.querySelector("dialog")!;
    await act(async () => Array.from(dialog.querySelectorAll("button")).find((button) => button.textContent === "Choisir des apprenants")!.click());
    const drawer = dialog.querySelector(".drawer")!;
    expect(drawer.closest("form")).toBeNull();
    expect(drawer.parentElement?.classList.contains("fixed")).toBe(true);
    await act(async () => drawer.querySelector<HTMLButtonElement>('button[aria-label="Retour"]')!.click());
    expect(document.querySelector("dialog")).toBe(dialog);
    expect(dialog.querySelector(".drawer")).toBeNull();
    expect(createGroup).not.toHaveBeenCalled();
  });

  afterEach(() => { act(() => root.unmount()); container.remove(); vi.restoreAllMocks(); });

  it("propose le choix désactivé puis la fréquence hebdomadaire lors de l'activation", async () => {
    const onSaved = vi.fn();
    await act(async () => root.render(<QueryClientProvider client={new QueryClient()}>
      <DropoutPreferencesForm initial={{ enabled: false, frequency: "weekly", hasParcours: true, onboardingRequired: true }} onSaved={onSaved} />
    </QueryClientProvider>));
    const checkbox = container.querySelector<HTMLInputElement>('input[type="checkbox"]')!;
    expect(checkbox.checked).toBe(false);
    await act(async () => checkbox.click());
    expect(container.querySelector<HTMLInputElement>('input[name="frequency"]')?.checked).toBe(true);
    expect(container.querySelector<HTMLInputElement>('input[name="frequency"]')?.classList.contains("radio")).toBe(true);
    await act(async () => container.querySelector<HTMLButtonElement>('button[type="submit"]')!.click());
    expect(update.mock.calls[0][0]).toEqual({ enabled: true, frequency: "weekly", minCritical: 1, completeOnboarding: true });
    expect(onSaved).toHaveBeenCalledOnce();
  });
});
