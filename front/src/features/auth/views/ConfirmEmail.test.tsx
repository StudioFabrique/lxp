import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { onboardingApi } from "../api/onboarding.api";
import AuthChatbotProvider from "../components/AuthChatbotProvider";
import ConfirmEmail from "./ConfirmEmail";

vi.mock("react-confetti", () => ({ default: () => null }));
vi.mock("../api/onboarding.api", () => ({
  onboardingApi: { confirmEmail: vi.fn() },
}));

describe("Confirmation de l'adresse email", () => {
  let container: HTMLDivElement;
  let root: Root;

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.clearAllMocks();
  });

  it("affiche la progression terminée et le mail validé après activation", async () => {
    let finishConfirmation!: (response: {
      success: boolean;
      email: string;
      message: string;
    }) => void;
    vi.mocked(onboardingApi.confirmEmail).mockImplementation(
      () => new Promise((resolve) => { finishConfirmation = resolve; }),
    );
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={["/confirm-email?token=activation-token"]}>
          <AuthChatbotProvider>
            <ConfirmEmail />
          </AuthChatbotProvider>
        </MemoryRouter>,
      );
    });

    expect(container.querySelector('[role="progressbar"]')?.getAttribute("aria-valuenow")).toBe("50");
    expect(container.querySelector(".lucide-mail-check")).toBeNull();

    await act(async () => {
      finishConfirmation({
        success: true,
        email: "root@test.fr",
        message: "Votre adresse email est validée et votre compte root est activé.",
      });
    });

    expect(container.querySelector('[role="progressbar"]')?.getAttribute("aria-valuenow")).toBe("100");
    await vi.waitFor(() => {
      expect(container.querySelector(".lucide-mail-check")).not.toBeNull();
    });
    await vi.waitFor(
      () => {
        expect(document.querySelector("[data-chatbot-bubble]")?.textContent).toContain(
          "Félicitations, votre compte est créé",
        );
      },
      { timeout: 5000 },
    );
    expect(document.querySelector("[data-chatbot-bubble]")?.textContent).toContain(
      "vous pouvez maintenant vous connecter",
    );
    expect(container.querySelector('a[href="/login"]')?.textContent).toBe("Continuer");
  });
});
