import { act, type ContextType, type PropsWithChildren } from "react";
import { createRoot, type Root } from "react-dom/client";
import { Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { ChatbotContext } from "../../../store/ChatbotProvider";
import { AiAskBubbleMenu } from "./AiAskBubbleMenu";

vi.mock("@tiptap/react/menus", () => ({
  BubbleMenu: ({ children }: PropsWithChildren) => <div>{children}</div>,
}));

let root: Root;
let container: HTMLDivElement;
let editor: Editor;
let setSelection: ReturnType<typeof vi.fn>;
beforeEach(async () => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  editor = new Editor({
    element: document.createElement("div"),
    extensions: [StarterKit],
    content: "<p>Bonjour tout le monde</p>",
    editable: false,
  });
  setSelection = vi.fn();
  await act(async () => root.render(
    <ChatbotContext.Provider value={{ setActivityTextSelection: setSelection } as unknown as ContextType<typeof ChatbotContext>}>
      <AiAskBubbleMenu editor={editor} mode="read" />
    </ChatbotContext.Provider>,
  ));
});
afterEach(async () => {
  await act(async () => root.unmount());
  editor.destroy();
  container.remove();
});

it("garde le même bouton pendant les changements de sélection", async () => {
  const button = container.querySelector("button");
  await act(async () => { editor.commands.setTextSelection({ from: 1, to: 8 }); });
  expect(container.querySelector("button")).toBe(button);
  await act(async () => { editor.commands.setTextSelection({ from: 1, to: 14 }); });
  expect(container.querySelector("button")).toBe(button);
});

it("préserve le texte sélectionné à l'appui et le transmet à l'assistant", async () => {
  await act(async () => { editor.commands.setTextSelection({ from: 1, to: 8 }); });
  const button = container.querySelector("button")!;
  const mouseDown = new MouseEvent("mousedown", { bubbles: true, cancelable: true });
  await act(async () => { button.dispatchEvent(mouseDown); });
  expect(mouseDown.defaultPrevented).toBe(true);
  expect(editor.state.selection.from).toBe(1);
  expect(editor.state.selection.to).toBe(8);
  await act(async () => button.click());
  expect(setSelection).toHaveBeenCalledWith("Bonjour");
  expect(editor.state.selection.empty).toBe(true);
});

it("ne remplace pas une sélection partielle par tout le paragraphe", async () => {
  await act(async () => { editor.commands.setTextSelection({ from: 1, to: 8 }); });
  const handled = editor.options.editorProps.handleClick?.call(
    editor.view, editor.view, 5, new MouseEvent("click"),
  );
  expect(handled).toBe(false);
  expect(editor.state.selection.to).toBe(8);
});

it("sélectionne toujours le paragraphe au clic simple sans sélection", async () => {
  await act(async () => { editor.commands.setTextSelection(1); });
  let handled: boolean | void;
  await act(async () => {
    handled = editor.options.editorProps.handleClick?.call(
      editor.view, editor.view, 5, new MouseEvent("click"),
    );
  });
  expect(handled!).toBe(true);
  expect(editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to)).toBe("Bonjour tout le monde");
});
