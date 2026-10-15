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
describe("paramètres de l’instance", () => {
  it("monte et initialise les champs depuis les paramètres chargés", async () => {
    vi.mocked(profileApi.queries.getInstanceSettings).mockResolvedValue({ name: "Organisme", website: "https://example.com", setupCompleted: true, hasLogo: false, enabledThemes: [...defaultEnabledThemes], emailTemplate: "minimal" });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, text: async () => "#ffffff" }));
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    try {
      await act(async () => { root.render(<InstanceGeneralSettings />); });
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
      await act(async () => { root.render(<InstanceGeneralSettings />); });
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
});
