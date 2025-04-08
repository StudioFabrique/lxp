import { useEditor } from "@tiptap/react";
import { ExtensionKit } from "../extensions/extension-kit";
import { initialContent } from "../lib/data/initialContent";

export const useBlockEditor = () => {
  const editor = useEditor({
    extensions: ExtensionKit(),
    autofocus: true,
    onCreate: ({ editor }) => {
      if (editor.isEmpty) {
        editor.commands.setContent(initialContent);
        editor.commands.focus("start");
      }
    },
    editorProps: {
      attributes: {
        class: "min-h-full",
      },
    },
  });

  return { editor };
};
