import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import apiClient from "../../../lib/axios";
import InstancePictureUpload from "./instance-picture-upload";

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

describe("InstancePictureUpload", () => {
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
      root.render(<InstancePictureUpload />);
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // La couleur est affichée sur le déclencheur du sélecteur (popover fermé par défaut).
    const colorTrigger = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Couleur de fond du logo"]',
    );
    expect(colorTrigger?.textContent).toBe("#A855F7");

    await act(async () => colorTrigger?.click());
    const blueButton = document.body.querySelector<HTMLButtonElement>(
      'button[title="Blue"]',
    );

    await act(async () => blueButton?.click());

    expect(apiClient.post).toHaveBeenCalledOnce();
    const [url, body] = vi.mocked(apiClient.post).mock.calls[0];
    expect(url).toBe("/instance-logo");
    expect(body).toBeInstanceOf(FormData);
    expect((body as FormData).get("color")).toBe("#3b82f6");
    expect((body as FormData).get("image")).toBeNull();
  });

  it("permet de supprimer le logo et réinitialise sa couleur", async () => {
    await act(async () => {
      root = createRoot(container);
      root.render(<InstancePictureUpload />);
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await act(async () => {
      container.querySelector("img")?.dispatchEvent(new Event("load"));
    });

    const deleteButton = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Supprimer le logo"]',
    );
    expect(deleteButton).toBeDefined();

    await act(async () => deleteButton?.click());

    const confirmButton = Array.from(document.body.querySelectorAll("button")).find(
      (button) => button.textContent?.includes("Confirmer"),
    );
    await act(async () => confirmButton?.click());

    expect(apiClient.delete).toHaveBeenCalledWith("/instance-logo");
    expect(
      container.querySelector('button[aria-label="Couleur de fond du logo"]')
        ?.textContent,
    ).toBe("#FFFFFF");
    expect(
      container.querySelector('button[aria-label="Supprimer le logo"]'),
    ).toBeNull();
  });
});
