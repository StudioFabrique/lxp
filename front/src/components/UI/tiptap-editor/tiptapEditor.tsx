import { type Editor, EditorContent } from "@tiptap/react";

import "./index.scss";
import "highlight.js/styles/github.css";

import MenuBar from "./components/MenuBar";

import { LinkMenu } from "./components/LinkMenu";

import SaveButton from "./components/SaveButton";
import { TableBubbleMenu } from "./components/TableBubbleMenu";
import useTiptapEditor from "./useTiptapEditor";
import { useRef } from "react";

type TiptapSimpleEditorProps = {
  mode: "read" | "write" | "edit";
  initialValue?: string;
  onSave?: () => void;
  onContentChange?: (content: string) => void;
};

export default function TiptapEditor({
  mode = "read",
  initialValue,
  onSave,
  onContentChange,
}: TiptapSimpleEditorProps) {
  const editorRef = useRef<Editor | null>(null);

  const { editor, menuContainerRef, isMenuBarSticky } = useTiptapEditor(
    "prose min-h-[12vh] m-1 w-[70%] py-5 focus:outline-none transition-all duration-200",
    editorRef,
    mode !== "read",
    initialValue,
    onContentChange
  );

  return (
    <>
      <div className={`editor relative`} ref={menuContainerRef}>
        {editor ? (
          <MenuBar
            shouldHide={mode === "read"}
            editor={editor}
            isSticky={isMenuBarSticky}
          />
        ) : null}
        <EditorContent
          className={`editor__content ${
            mode === "read" ? "mt-5" : "cursor-text mt-5"
          }`}
          onClick={() => editor?.commands.focus()}
          editor={editor}
        />

        {onSave &&
          mode !== "read" &&
          editorRef.current &&
          editorRef.current.getText()?.length > 0 && (
            <SaveButton onSave={onSave} />
          )}
      </div>
      {editor && <LinkMenu editor={editor} appendTo={menuContainerRef} />}
      {editor && editor.isEditable && <TableBubbleMenu editor={editor} />}
    </>
  );
}
