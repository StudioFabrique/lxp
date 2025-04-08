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
        class:
          "prose min-h-[12vh] m-1 max-w-full p-1 focus:outline-none hover:ring-2 hover:ring-primary/20 transition-all duration-200",
      },
    },
  });

  return { editor };
};
