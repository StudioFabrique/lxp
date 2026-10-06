import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
import { afterEach, describe, expect, it } from "vitest";
import { TableInsertPopover } from "./TableInsertPopover";

let root: Root;
let editor: Editor;
let container: HTMLDivElement;
async function mount(): Promise<void> {
  editor = new Editor({ extensions: [StarterKit, Table, TableRow, TableCell, TableHeader] });
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () => root.render(<TableInsertPopover editor={editor} title="Tableau" />));
  await act(async () => container.querySelector("button")?.click());
}
afterEach(() => { act(() => root?.unmount()); editor?.destroy(); container?.remove(); });

describe("Sélection de tableau", () => {
  it("sélectionne les dimensions au clavier et insère le tableau", async () => {
    await mount();
    const first = document.querySelector<HTMLButtonElement>('[aria-label="1 ligne, 1 colonne"]');
    if (!first) throw new Error("Grille absente");
    act(() => first.focus());
    act(() => first.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })));
    const second = document.activeElement;
    act(() => second?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })));
    expect(document.activeElement?.getAttribute("aria-label")).toBe("2 lignes, 2 colonnes");
    expect(document.querySelector('[aria-live="polite"]')?.textContent).toBe("2 × 2");
    await act(async () => { if (document.activeElement instanceof HTMLButtonElement) document.activeElement.click(); });
    const rows = editor.view.dom.querySelectorAll("tr");
    expect(rows).toHaveLength(2);
    expect(rows[0].querySelectorAll("th")).toHaveLength(2);
    expect(document.querySelector('[aria-label="Dimensions du tableau"]')).toBeNull();
  });

  it("conserve le format rapide 2 × 2 sans en-tête", async () => {
    await mount();
    await act(async () => document.querySelector<HTMLButtonElement>('[aria-label="Insérer 2 lignes et 2 colonnes sans en-tête"]')?.click());
    expect(editor.view.dom.querySelectorAll("tr")).toHaveLength(2);
    expect(editor.view.dom.querySelectorAll("td")).toHaveLength(4);
    expect(editor.view.dom.querySelectorAll("th")).toHaveLength(0);
  });
});
