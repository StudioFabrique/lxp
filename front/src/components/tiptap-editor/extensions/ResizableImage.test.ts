import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("../../../config/urls", () => ({
  ACTIVITIES: "http://localhost:3000/activities/",
}));

import { ResizableImage } from "./ResizableImage";

let editor: Editor | undefined;
afterEach(() => editor?.destroy());

describe("Images HTML des parcours importés", () => {
  it.each([
    "/activities/images/imported.png",
    "activities/images/imported.png",
  ])("charge %s depuis l’API dans le lecteur", (src) => {
    editor = new Editor({
      extensions: [StarterKit, ResizableImage],
      content: `<p>Contenu importé</p><img src="${src}" alt="Schéma" width="240">`,
    });

    const image = editor.view.dom.querySelector("img");
    expect(image?.getAttribute("src")).toBe(
      "http://localhost:3000/activities/images/imported.png",
    );
    expect(image?.getAttribute("alt")).toBe("Schéma");
    expect(image?.getAttribute("width")).toBe("240");
  });

  it.each([
    "http://localhost:3000/activities/images/moodle.png",
    "https://example.com/illustration.png",
    "blob:http://localhost:5173/pending-upload",
  ])("conserve la source existante %s", (src) => {
    editor = new Editor({
      extensions: [StarterKit, ResizableImage],
      content: `<img src="${src}">`,
    });
    expect(editor.view.dom.querySelector("img")?.getAttribute("src")).toBe(src);
  });
});
