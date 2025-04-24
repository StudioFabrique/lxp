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
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import { all, createLowlight } from "lowlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { type Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "./index.scss";
import "highlight.js/styles/github.css";

import MenuBar from "./components/MenuBar";
import { type Dispatch, type SetStateAction, useEffect, useRef } from "react";
import { LinkMenu } from "./components/LinkMenu";
import Can from "../../../UI/can/can.component";
import { Edit } from "lucide-react";

const lowlight = createLowlight(all);

type TiptapSimpleEditorProps = {
  editorRef: React.MutableRefObject<Editor | null>;
  initialValue?: string;
  disableEditButton?: boolean;
  isEditingActivity: boolean;
  setEditingActivity: Dispatch<SetStateAction<boolean>>;
  onCloseEditor?: () => void;
  onSave?: () => void;
};

export default function TiptapSimpleEditor({
  editorRef,
  initialValue,
  disableEditButton,
  isEditingActivity,
  setEditingActivity,
  onCloseEditor,
  onSave,
}: TiptapSimpleEditorProps) {
  const handleCloseEditor = () => {
    onCloseEditor?.();
    setEditingActivity(false);
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight.configure({ multicolor: true }),
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
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: "bash",
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image,
      TextStyle,
      Color,
      FontFamily,
      Link,
      Youtube,
    ],
    content: initialValue,
    editable: isEditingActivity,
    editorProps: {
      attributes: {
        class:
          "prose min-h-[12vh] m-1 w-[100%] max-w-[50%] py-5 focus:outline-none transition-all duration-200",
      },
    },
  });

  const menuContainerRef = useRef(null);

  useEffect(() => {
    if (editor) {
      editorRef.current = editor;
      editorRef.current.commands.focus();
    }
  }, [editor, editorRef]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditingActivity);
    }
  }, [editor, isEditingActivity]);

  return (
    <>
      {isEditingActivity ? <hr className="border-primary/20 pb-5" /> : null}
      <div className="editor relative" ref={menuContainerRef}>
        {editor ? (
          <MenuBar
            shouldHide={!isEditingActivity}
            editor={editor}
            onCloseEditor={handleCloseEditor}
            onSave={onSave}
          />
        ) : null}
        <EditorContent
          className={`editor__content${isEditingActivity ? " cursor-text" : " py-10"}`}
          onClick={() => editor?.commands.focus()}
          editor={editor}
        />

        {!isEditingActivity && (
          <div>
            <Can action="update" object="lesson">
              <button
                type="button"
                className="btn btn-ghost absolute top-4 right-4 tooltip tooltip-left"
                data-tip="Modifier l'activité"
                onClick={() => setEditingActivity(true)}
                disabled={disableEditButton}
              >
                <Edit className="w-5 h-5" />
              </button>
            </Can>
          </div>
        )}
      </div>
      {editor ? <LinkMenu editor={editor} appendTo={menuContainerRef} /> : null}
    </>
  );
}
