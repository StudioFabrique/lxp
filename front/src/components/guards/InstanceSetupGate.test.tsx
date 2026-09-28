import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router";
import { AuthContext } from "../../store/AuthProvider";
import { profileApi } from "../../features/profile/api/profile.api";
import InstanceSetupGate from "./InstanceSetupGate";

vi.mock("../../features/profile/api/profile.api", () => ({
  profileApi: { queries: { getInstanceSettings: vi.fn() } },
}));

const getInstanceSettings = vi.mocked(profileApi.queries.getInstanceSettings);
let container: HTMLDivElement;
let root: Root;

const renderAt = async (rank: number) => {
  await act(async () => {
    root.render(
      <AuthContext value={{ user: { roles: [{ rank }] } } as never}>
        <MemoryRouter initialEntries={["/admin"]}>
          <Routes>
            <Route element={<InstanceSetupGate />}>
              <Route path="/admin" element={<p>layout-admin</p>} />
            </Route>
            <Route path="/instance-setup" element={<p>configuration-instance</p>} />
          </Routes>
        </MemoryRouter>
      </AuthContext>,
    );
  });
};

describe("InstanceSetupGate", () => {
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    getInstanceSettings.mockReset();
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it("attend la configuration avant de monter le layout admin", async () => {
    let resolveSettings!: (value: { setupCompleted: boolean }) => void;
    getInstanceSettings.mockReturnValue(new Promise((resolve) => {
      resolveSettings = resolve as typeof resolveSettings;
    }));

    await renderAt(0);
    expect(container.querySelector('[role="status"]')?.getAttribute("aria-label"))
      .toBe("Vérification de la configuration de l’instance");
    expect(container.textContent).not.toContain("layout-admin");
    expect(container.querySelector(".skeleton")).toBeNull();

    await act(async () => resolveSettings({ setupCompleted: false }));
    expect(container.textContent).toContain("configuration-instance");
    expect(container.textContent).not.toContain("layout-admin");
  });

  it("monte le layout quand la configuration est terminée", async () => {
    getInstanceSettings.mockResolvedValue({ setupCompleted: true } as never);
    await renderAt(0);
    expect(container.textContent).toContain("layout-admin");
  });

  it("laisse passer les autres administrateurs sans vérification", async () => {
    await renderAt(1);
    expect(container.textContent).toContain("layout-admin");
    expect(getInstanceSettings).not.toHaveBeenCalled();
  });
});
