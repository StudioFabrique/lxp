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
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe("Personnalisez votre espace", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(async () => {
    vi.mocked(profileApi.queries.getInstanceSettings).mockResolvedValue({
      name: "ANDRIA",
      setupCompleted: false,
      hasLogo: false,
      enabledThemes: ["classic", "classic-dark"],
      emailTemplate: "minimal",
    });
    vi.mocked(profileApi.mutations.updateInstanceSettings).mockResolvedValue({
      name: "ANDRIA",
      setupCompleted: true,
      hasLogo: false,
      enabledThemes: ["classic", "classic-dark"],
      emailTemplate: "minimal",
    });

    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    await act(async () => root.render(<InstanceSetup />));
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.clearAllMocks();
  });

  it("prévisualise et enregistre la couleur choisie", async () => {
    await act(async () => {
      container.querySelector<HTMLButtonElement>('button[title="Blue"]')?.click();
    });

    expect(container.querySelector('[data-testid="logo-preview"]')?.getAttribute("data-background"))
      .toBe("#3b82f6");

    await act(async () => {
      container.querySelector("form")?.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true }),
      );
    });

    const payload = vi.mocked(profileApi.mutations.updateInstanceSettings).mock.calls[0]?.[0];
    expect(payload).toBeInstanceOf(FormData);
    expect(payload?.get("color")).toBe("#3b82f6");
  });

  it("garde le fond blanc avec les paramètres ANDRIA par défaut", async () => {
    await act(async () => {
      container.querySelector<HTMLButtonElement>('button[title="Blue"]')?.click();
      Array.from(container.querySelectorAll("button"))
        .find((button) => button.textContent?.includes("Continuer avec ANDRIA"))
        ?.click();
    });

    const payload = vi.mocked(profileApi.mutations.updateInstanceSettings).mock.calls[0]?.[0];
    expect(payload?.get("color")).toBe("#ffffff");
  });
});
