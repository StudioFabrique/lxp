import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import apiClient from "../../../lib/axios";
import CompanyPictureUpload from "./company-picture-upload";

vi.mock("../../../lib/axios", () => ({
  default: {
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("CompanyPictureUpload", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        text: vi.fn().mockResolvedValue("#a855f7\n"),
      }),
    );

    vi.mocked(apiClient.post).mockResolvedValue({
      data: { message: "Personnalisation sauvegardée" },
    });
    vi.mocked(apiClient.delete).mockResolvedValue({
      data: { message: "Logo supprimé" },
    });
  });

  afterEach(() => {
    act(() => root?.unmount());
    container.remove();
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it("restaure la couleur sauvegardée et sauvegarde une couleur seule", async () => {
    await act(async () => {
      root = createRoot(container);
      root.render(<CompanyPictureUpload />);
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const colorInput = container.querySelector<HTMLInputElement>(
      'input[type="color"]',
    );
    expect(colorInput?.value).toBe("#a855f7");

    const blueButton = container.querySelector<HTMLButtonElement>(
      'button[title="Blue"]',
    );

    await act(async () => blueButton?.click());

    expect(apiClient.post).toHaveBeenCalledOnce();
    const [url, body] = vi.mocked(apiClient.post).mock.calls[0];
    expect(url).toBe("/company-logo");
    expect(body).toBeInstanceOf(FormData);
    expect((body as FormData).get("color")).toBe("#3b82f6");
    expect((body as FormData).get("image")).toBeNull();
  });

  it("permet de supprimer le logo et réinitialise sa couleur", async () => {
    await act(async () => {
      root = createRoot(container);
      root.render(<CompanyPictureUpload />);
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await act(async () => {
      container.querySelector("img")?.dispatchEvent(new Event("load"));
    });

    const deleteButton = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent?.includes("Supprimer le logo"),
    );
    expect(deleteButton).toBeDefined();

    await act(async () => deleteButton?.click());

    const confirmButton = Array.from(document.body.querySelectorAll("button")).find(
      (button) => button.textContent?.includes("Confirmer"),
    );
    await act(async () => confirmButton?.click());

    expect(apiClient.delete).toHaveBeenCalledWith("/company-logo");
    expect(
      container.querySelector<HTMLInputElement>('input[type="color"]')?.value,
    ).toBe("#ffffff");
    expect(container.textContent).not.toContain("Supprimer le logo");
  });
});
