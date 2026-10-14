import { act, useEffect, useRef } from "react";
import { createRoot, type Root } from "react-dom/client";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useMenuContentTypes } from "./useMenuContentTypes";
import { ResizableImage } from "../../extensions/ResizableImage";

vi.mock("../../../../lib/axios", () => ({ default: { post: vi.fn() } }));
let root: Root;
let editor: Editor;
let container: HTMLDivElement;
let actions: ReturnType<typeof useMenuContentTypes>;

function ImageUploadHarness({ editor }: { editor: Editor }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const currentActions = useMenuContentTypes(editor, inputRef);
  useEffect(() => { actions = currentActions; }, [currentActions]);
  return <input ref={inputRef} type="file" />;
}

function mount(): void {
  editor = new Editor({ extensions: [StarterKit, ResizableImage] });
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() => root.render(<ImageUploadHarness editor={editor} />));
}

afterEach(() => {
  act(() => root?.unmount());
  editor?.destroy();
  container?.remove();
  vi.unstubAllGlobals();
});

describe("Tailles des images insérées", () => {
  it.each([["small", "25%"], ["medium", "50%"], ["large", "100%"]] as const)("applique %s aux URL et fichiers", (size, width) => {
    vi.stubGlobal("URL", class extends URL { static createObjectURL = vi.fn(() => "blob:local-image"); });
    mount();
    act(() => actions.onImageUploadFromURL("https://example.com/image.png", size));
    expect(editor.view.dom.querySelector("img")?.style.width).toBe(width);
    act(() => editor.commands.setContent("<p>Insertion locale</p>"));
    const input = container.querySelector("input");
    if (!input) throw new Error("Champ fichier absent");
    Object.defineProperty(input, "files", { value: [new File(["image"], "image.png", { type: "image/png" })] });
    act(() => {
      actions.onClickImageUpload(size);
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });
    const images = editor.view.dom.querySelectorAll("img");
    expect(images).toHaveLength(1);
    expect(images[0].style.width).toBe(width);
    expect(images[0].getAttribute("src")).toBe("blob:local-image");
  });
});
