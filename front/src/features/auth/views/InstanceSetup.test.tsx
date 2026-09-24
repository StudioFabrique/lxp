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
    await act(async () => root.render(<InstanceSetup />));
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
});
