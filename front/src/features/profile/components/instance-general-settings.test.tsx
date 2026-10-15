import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import InstanceGeneralSettings from "./instance-general-settings";
import { profileApi } from "../api/profile.api";
import { defaultEnabledThemes } from "../../../config/themes";

vi.mock("../api/profile.api", () => ({ profileApi: {
  queries: { getInstanceSettings: vi.fn() }, mutations: { updateInstanceSettings: vi.fn() },
} }));
vi.mock("./email-template-settings", () => ({ default: () => null }));
vi.mock("../../../components/UI/instance-logo-controls", () => ({ default: () => null }));

afterEach(() => vi.unstubAllGlobals());

const Wrapped = () => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    <InstanceGeneralSettings />
  </QueryClientProvider>
);

const baseSettings = { name: "Organisme", website: "https://example.com", setupCompleted: true, hasLogo: false, enabledThemes: [...defaultEnabledThemes], emailTemplate: "minimal" as const };

describe("paramètres de l’instance", () => {
  it("monte et initialise les champs depuis les paramètres chargés", async () => {
    vi.mocked(profileApi.queries.getInstanceSettings).mockResolvedValue({ name: "Organisme", website: "https://example.com", setupCompleted: true, hasLogo: false, enabledThemes: [...defaultEnabledThemes], emailTemplate: "minimal" });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, text: async () => "#ffffff" }));
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    try {
      await act(async () => { root.render(<Wrapped />); });
      expect(container.textContent).toContain("Identité de l’organisme");
      expect(container.querySelector<HTMLInputElement>('input')?.value).toBe("Organisme");
      expect(container.querySelector<HTMLInputElement>('input[inputmode="url"]')?.value).toBe("https://example.com");
    } finally { act(() => root.unmount()); container.remove(); }
  });

  it("sauvegarde l’identité et les thèmes en une seule requête depuis l’en-tête", async () => {
    vi.mocked(profileApi.queries.getInstanceSettings).mockResolvedValue({ name: "Organisme", website: "https://example.com", setupCompleted: true, hasLogo: false, enabledThemes: [...defaultEnabledThemes], emailTemplate: "minimal" });
    vi.mocked(profileApi.mutations.updateInstanceSettings).mockResolvedValue({ name: "Organisme", website: "https://example.com", setupCompleted: true, hasLogo: false, enabledThemes: [...defaultEnabledThemes], emailTemplate: "minimal" });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, text: async () => "#ffffff" }));
    vi.stubGlobal("location", { ...window.location, reload: vi.fn() });
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    try {
      await act(async () => { root.render(<Wrapped />); });
      const saveButtons = Array.from(container.querySelectorAll("button")).filter((button) => button.textContent === "Tout sauvegarder");
      expect(saveButtons).toHaveLength(1);
      expect(container.querySelector('form button[type="submit"]')).toBeNull();

      await act(async () => { saveButtons[0].click(); });

      expect(profileApi.mutations.updateInstanceSettings).toHaveBeenCalledOnce();
      const payload = vi.mocked(profileApi.mutations.updateInstanceSettings).mock.calls[0][0] as FormData;
      expect(payload.get("name")).toBe("Organisme");
      expect(JSON.parse(String(payload.get("enabledThemes")))).toEqual([...defaultEnabledThemes]);
    } finally { act(() => root.unmount()); container.remove(); }
  });

  it("modifie les noms des rôles avec le formulaire de l’onboarding et ne les envoie que depuis la modale", async () => {
    vi.mocked(profileApi.queries.getInstanceSettings).mockResolvedValue({ ...baseSettings, roleLabels: { "2": "Formateur" } });
    vi.mocked(profileApi.mutations.updateInstanceSettings).mockResolvedValue({ ...baseSettings, roleLabels: { "1": "Administrateur", "2": "Ressources pédagogiques", "3": "Apprenant", "4": "Visiteur" } });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, text: async () => "#ffffff" }));
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    const click = async (label: string) => act(async () => {
      Array.from(document.querySelectorAll("button")).find((button) => button.textContent?.trim() === label)?.click();
    });
    const input = (name: string) => document.querySelector<HTMLInputElement>(`input[name="${name}"]`) as HTMLInputElement;
    try {
      await act(async () => { root.render(<Wrapped />); });
      expect(container.textContent).toContain("Noms des rôles");
      expect(container.textContent).toContain("Formateur");

      await click("Modifier les noms");
      expect(input("team").value).toBe("Formateur");
      expect(input("admin").value).toBe("Administrateur");
      expect(document.body.textContent).toContain("Aperçu dans l’application");

      await act(async () => {
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input("team"), "Ressources pédagogiques");
        input("team").dispatchEvent(new Event("input", { bubbles: true }));
      });
      await click("Enregistrer");

      expect(profileApi.mutations.updateInstanceSettings).toHaveBeenCalledOnce();
      const payload = vi.mocked(profileApi.mutations.updateInstanceSettings).mock.calls[0][0] as FormData;
      expect(JSON.parse(String(payload.get("roleLabels")))).toEqual({ "1": "Administrateur", "2": "Ressources pédagogiques", "3": "Apprenant", "4": "Visiteur" });
      expect(document.querySelector("dialog")).toBeNull();
    } finally { act(() => root.unmount()); container.remove(); }
  });

  it("n’envoie pas les noms des rôles quand la modale est refermée ou le libellé invalide", async () => {
    vi.mocked(profileApi.queries.getInstanceSettings).mockResolvedValue(baseSettings);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, text: async () => "#ffffff" }));
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    const click = async (label: string) => act(async () => {
      Array.from(document.querySelectorAll("button")).find((button) => button.textContent?.trim() === label)?.click();
    });
    try {
      await act(async () => { root.render(<Wrapped />); });
      await click("Modifier les noms");
      const team = document.querySelector<HTMLInputElement>('input[name="team"]') as HTMLInputElement;
      await act(async () => {
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(team, "apprenant");
        team.dispatchEvent(new Event("input", { bubbles: true }));
      });
      await click("Enregistrer");
      expect(document.body.textContent).toContain("Chaque rôle doit porter un libellé différent.");
      expect(profileApi.mutations.updateInstanceSettings).not.toHaveBeenCalled();
      await click("Annuler");
      expect(document.querySelector("dialog")).toBeNull();
    } finally { act(() => root.unmount()); container.remove(); }
  });
});
