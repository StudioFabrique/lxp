import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import toast from "react-hot-toast";
import { AuthContext } from "../../../../store/AuthProvider";
import { profileApi } from "../../api/profile.api";
import { onboardingApi } from "../../../auth/api/onboarding.api";
import PromoteToRoot from "./promote-to-root";

vi.mock("../../api/profile.api", () => ({
  profileApi: { mutations: { promoteToRoot: vi.fn() } },
}));

vi.mock("../../../auth/api/onboarding.api", () => ({
  onboardingApi: { getSetupStatus: vi.fn() },
}));

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

describe("PromoteToRoot", () => {
  let container: HTMLDivElement;
  let root: Root;
  const handshake = vi.fn();

  beforeEach(async () => {
    (
      globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
    ).IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement("div");
    document.body.appendChild(container);
    vi.mocked(onboardingApi.getSetupStatus).mockResolvedValue({
      hasAdmins: true,
      activationTokenTtlMinutes: 45,
    });
    vi.mocked(profileApi.mutations.promoteToRoot).mockResolvedValue({
      success: true,
      message: "Votre compte possède maintenant le rôle root.",
    });

    await act(async () => {
      root = createRoot(container);
      root.render(
        <AuthContext value={{ handshake } as never}>
          <PromoteToRoot />
        </AuthContext>,
      );
    });
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.clearAllMocks();
  });

  it("affiche la durée configurée et promeut le compte avec la clé", async () => {
    expect(container.textContent).toContain("45 minutes");

    const input = container.querySelector<HTMLInputElement>("input");
    await act(async () => {
      if (input) {
        const valueSetter = Object.getOwnPropertyDescriptor(
          HTMLInputElement.prototype,
          "value",
        )?.set;
        valueSetter?.call(input, "  activation-key  ");
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });

    await act(async () => {
      container
        .querySelector<HTMLFormElement>("form")
        ?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });

    expect(profileApi.mutations.promoteToRoot).toHaveBeenCalledWith(
      "activation-key",
    );
    expect(handshake).toHaveBeenCalledOnce();
    expect(toast.success).toHaveBeenCalledWith(
      "Votre compte possède maintenant le rôle root.",
    );
  });
});
