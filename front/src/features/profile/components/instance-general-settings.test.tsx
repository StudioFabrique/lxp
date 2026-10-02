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
});
