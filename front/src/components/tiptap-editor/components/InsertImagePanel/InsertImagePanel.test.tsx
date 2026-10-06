import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { InsertImagePanel } from "./InsertImagePanel";

let root: Root;
let container: HTMLDivElement;
afterEach(() => { act(() => root?.unmount()); container?.remove(); });

function mount(onSetLink = vi.fn(), onClickUpload = vi.fn()): void {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() => root.render(<InsertImagePanel onSetLink={onSetLink} onClickUpload={onClickUpload} />));
}

async function setUrl(value: string): Promise<void> {
  const input = container.querySelector<HTMLInputElement>('input[type="url"]');
  if (!input) throw new Error("Champ URL absent");
  await act(async () => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

async function submit(): Promise<void> {
  await act(async () => { container.querySelector("form")?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })); });
}

describe("Insertion d'image", () => {
  it.each(["small", "medium", "large"])("transmet la taille %s avec l'URL validée", async (size) => {
    const onSetLink = vi.fn();
    mount(onSetLink);
    act(() => container.querySelector<HTMLInputElement>(`input[value="${size}"]`)?.click());
    await setUrl("https://example.com/image.png");
    await submit();
    expect(onSetLink).toHaveBeenCalledWith("https://example.com/image.png", size);
  });

  it.each(["", "adresse invalide", "javascript:alert(1)"])("rejette l'URL %s sans insertion", async (url) => {
    const onSetLink = vi.fn();
    mount(onSetLink);
    await setUrl(url);
    await submit();
    expect(onSetLink).not.toHaveBeenCalled();
    expect(container.querySelector('input[type="url"]')?.getAttribute("aria-invalid")).toBe("true");
    expect(container.querySelector(".text-error")?.textContent).toBeTruthy();
  });

  it("transmet la taille du fichier local même après une erreur d'URL", async () => {
    const onClickUpload = vi.fn();
    mount(vi.fn(), onClickUpload);
    await submit();
    act(() => container.querySelector<HTMLInputElement>('input[value="large"]')?.click());
    await act(async () => { container.querySelector<HTMLButtonElement>('button[type="button"]')?.click(); });
    expect(onClickUpload).toHaveBeenCalledWith("large");
    expect(container.querySelector(".text-error")).toBeNull();
  });
});
