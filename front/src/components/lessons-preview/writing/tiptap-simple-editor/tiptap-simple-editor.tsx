import CharacterCount from "@tiptap/extension-character-count";
import Highlight from "@tiptap/extension-highlight";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import { FontFamily } from "@tiptap/extension-font-family";
import { Color } from "@tiptap/extension-color";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "./index.scss";

import MenuBar from "./components/MenuBar";

type TiptapSimpleEditorProps = {
  onCloseEditor: () => void;
};

export default function TiptapSimpleEditor({
  onCloseEditor,
}: TiptapSimpleEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure(),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      TaskList,
      TaskItem,
      CharacterCount.configure({
        limit: 10000,
      }),
      Table.configure({
        resizable: true,
        // HTMLAttributes: {
        //   class: "my-custom-class",
        // },
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image,
      TextStyle,
      Color,
      FontFamily,
    ],
    editorProps: {
      attributes: {
        class:
          "prose min-h-[12vh] m-1 max-w-full p-1 focus:outline-none hover:ring-2 hover:ring-primary/20 transition-all duration-200",
      },
    },
  });

  return (
    <div className="editor">
      {editor && <MenuBar editor={editor} onCloseEditor={onCloseEditor} />}
      <EditorContent className="editor__content" editor={editor} />
    </div>
  );
}
