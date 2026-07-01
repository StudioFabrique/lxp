import { type Editor, EditorContent } from "@tiptap/react";

import "./index.scss";
import "highlight.js/styles/github.css";

import MenuBar from "./components/Menubar/MenuBar";

import SaveButton from "./components/SaveButton";
import { TableBubbleMenu } from "./components/TableBubbleMenu";
import useTiptapEditor from "./useTiptapEditor";
import { useRef, useState } from "react";
import { AiAskBubbleMenu } from "./components/AiAskBubbleMenu";
import LinkMenu from "./components/LinkMenu/LinkMenu";

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

  const {
    editor,
    menuContainerRef,
    stickyMarkerRef,
    isMenuBarSticky,
    readTimeMinutes,
  } = useTiptapEditor(
    "prose min-h-[12vh] m-1 w-full focus:outline-none transition-all duration-200",
    editorRef,
    mode !== "read",
    initialValue,
    onContentChange,
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
      {mode === "read" && (
        <div className="flex justify-end text-gray-500 text-sm">
          <span className="mr-1">Temps estimé de lecture :</span>
          <span>
            {readTimeMinutes > 0
              ? `${readTimeMinutes} minutes`
              : "moins d'une minute"}
          </span>
        </div>
      )}
      <div className="editor relative w-[70%] mx-auto" ref={menuContainerRef}>
        <div
          ref={stickyMarkerRef}
          className="absolute -top-6 left-0 w-full h-4 pointer-events-none"
        />

        {/* Placeholder pour éviter le saut de contenu quand le menu devient fixed */}
        {isMenuBarSticky && <div className="h-14 mb-2 w-full" />}

        {editor ? (
          <MenuBar
            shouldHide={mode === "read"}
            editor={editor}
            isSticky={isMenuBarSticky}
            onUploadAllImagesRef={uploadAllImagesRef}
          />
        ) : null}

        <EditorContent
          className={`editor__content mt-5 ${
            mode === "read" ? "" : "cursor-text"
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
      {editor && editor.isEditable && (
        <LinkMenu editor={editor} appendTo={menuContainerRef} />
      )}
      {editor && editor.isEditable && <TableBubbleMenu editor={editor} />}
      {editor && <AiAskBubbleMenu mode={mode} editor={editor} />}
    </>
  );
}
