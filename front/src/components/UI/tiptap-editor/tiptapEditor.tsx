import { type Editor, EditorContent } from "@tiptap/react";

import "./index.scss";
import "highlight.js/styles/github.css";

import MenuBar from "./components/Menubar/MenuBar";

import { LinkMenu } from "./components/LinkMenu";

import SaveButton from "./components/SaveButton";
import { TableBubbleMenu } from "./components/TableBubbleMenu";
import useTiptapEditor from "./useTiptapEditor";
import { useRef, useState } from "react";

type TiptapEditorProps = {
  mode: "read" | "write" | "edit" | "activity_type_selection";
  initialValue?: string;
  pending?: boolean;
  onSave?: (finalContent: string) => Promise<void>;
  onContentChange?: (content: string) => void;
};

export default function TiptapEditor({
  mode = "read",
  initialValue,
  pending,
  onSave,
  onContentChange,
}: TiptapEditorProps) {
  const editorRef = useRef<Editor | null>(null);
  const uploadAllImagesRef = useRef<(() => Promise<void>) | null>(null);
  const [isImageUploadPending, setImageUploadPending] = useState(false);

  const { editor, menuContainerRef, isMenuBarSticky } = useTiptapEditor(
    "prose min-h-[12vh] m-1 w-[70%] py-5 focus:outline-none transition-all duration-200",
    editorRef,
    mode !== "read",
    initialValue,
    onContentChange
  );

  const handleSave = async () => {
    if (uploadAllImagesRef.current) {
      setImageUploadPending(true);
      await uploadAllImagesRef.current();
      setImageUploadPending(false);
    }

    await new Promise((resolve) => setTimeout(resolve, 100));

    const finalContent = editor?.getHTML() || "";
    await onSave?.(finalContent);
  };

  return (
    <>
      <div className={`editor relative`} ref={menuContainerRef}>
        {editor ? (
          <MenuBar
            shouldHide={mode === "read"}
            editor={editor}
            isSticky={isMenuBarSticky}
            onUploadAllImagesRef={uploadAllImagesRef} // Pass ref
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
            <SaveButton
              pending={pending || isImageUploadPending}
              onSave={handleSave}
            />
          )}
      </div>
      {editor && <LinkMenu editor={editor} appendTo={menuContainerRef} />}
      {editor && editor.isEditable && <TableBubbleMenu editor={editor} />}
    </>
  );
}
