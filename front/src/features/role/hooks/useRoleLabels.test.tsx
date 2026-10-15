import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, it, vi } from "vitest";
import { profileApi } from "../../profile/api/profile.api";

vi.mock("../../profile/api/profile.api", () => ({
  profileApi: { queries: { getInstanceSettings: vi.fn() } },
}));

describe("useRoleLabels", () => {
  it("renvoie les libellés de l'instance, puis les valeurs par défaut sans eux", async () => {
    const { useRoleLabels } =
      await vi.importActual<typeof import("./useRoleLabels")>("./useRoleLabels");
    vi.mocked(profileApi.queries.getInstanceSettings).mockResolvedValue({
      name: "ANDRIA",
      website: "",
      setupCompleted: true,
      hasLogo: false,
      enabledThemes: [],
      emailTemplate: "minimal",
      roleLabels: { "2": "Ressources pédagogiques" },
    });
    let seen: ReturnType<typeof useRoleLabels> | undefined;
    const Probe = (): ReactNode => {
      seen = useRoleLabels();
      return null;
    };
    const container = document.createElement("div");
    const root = createRoot(container);

    await act(async () =>
      root.render(
        <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
          <Probe />
        </QueryClientProvider>,
      ),
    );

    await vi.waitFor(() =>
      expect(seen?.teamLabel).toBe("Ressources pédagogiques"),
    );
    expect(seen?.teamInlineLabel).toBe("ressources pédagogiques");
    expect(seen?.getRoleLabel(1)).toBe("Administrateur");
    expect(seen?.getRoleLabel(0, "Root")).toBe("Root");
    act(() => root.unmount());
  });
});
