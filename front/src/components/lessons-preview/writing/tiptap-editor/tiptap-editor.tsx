import CharacterCount from "@tiptap/extension-character-count";
import Highlight from "@tiptap/extension-highlight";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";

import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import { FontFamily } from "@tiptap/extension-font-family";
import { Color } from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import { all, createLowlight } from "lowlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import {
  type Editor,
  EditorContent,
  ReactNodeViewRenderer,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "./index.scss";
import "highlight.js/styles/github.css";

import MenuBar from "./components/MenuBar";
import { useEffect, useRef, useState } from "react";
import { LinkMenu } from "./components/LinkMenu";
import Can from "../../../UI/can/can.component";
import { Trash2 } from "lucide-react";
import CodeBlockWithCopy from "./extensions/CodeBlockWithCopy/CodeBlockWithCopy";
import { ResizableImage } from "./extensions/ResizableImage";
import SaveButton from "./components/SaveButton";
import { TableBubbleMenu } from "./components/TableBubbleMenu";
import { TableKeyboardShortcuts } from "./extensions/TableKeyboardShortcuts";

const lowlight = createLowlight(all);

type TiptapSimpleEditorProps = {
  editorRef: React.MutableRefObject<Editor | null>;
  initialValue?: string;
  isEditingActivity: boolean;
  onSave?: () => void;
  onContentChange?: (content: string) => void;
  onDeleteActivity?: () => void;
};

export default function TiptapEditor({
  editorRef,
  initialValue,
  isEditingActivity,
  onSave,
  onContentChange,
  onDeleteActivity,
}: TiptapSimpleEditorProps) {
  const [isMenuBarSticky, setIsMenuBarSticky] = useState(false);

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
        HTMLAttributes: {
          class: "tiptap-table",
        },
        allowTableNodeSelection: true,
      }),
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockWithCopy);
        },
      }).configure({ lowlight }),
      TableRow,
      TableHeader,
      TableCell,
      ResizableImage,
      TextStyle,
      Color,
      FontFamily,
      Link,
      Youtube,
      TableKeyboardShortcuts,
    ],
    content: initialValue,
    editable: isEditingActivity,
    editorProps: {
      attributes: {
        class:
          "prose min-h-[12vh] m-1 w-[70%] py-5 focus:outline-none transition-all duration-200",
      },
    },
    onUpdate: ({ editor }) => {
      // Appelle onContentChange lors de la mise à jour du contenu
      if (onContentChange && isEditingActivity) {
        onContentChange(editor.getHTML());
      }
    },
  });

  const menuContainerRef = useRef<HTMLDivElement>(null);

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

  // Effet pour mettre à jour le contenu de l'éditeur lorsque initialValue change
  useEffect(() => {
    if (
      editor &&
      initialValue !== undefined &&
      editor.getHTML() !== initialValue
    ) {
      editor.commands.setContent(initialValue);
    }
  }, [editor, initialValue]);

  // Effet pour détecter quand le composant sort de la vue et rendre la menu bar sticky
  useEffect(() => {
    if (!isEditingActivity || !menuContainerRef.current) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (!menuContainerRef.current) return;

          const containerRect =
            menuContainerRef.current.getBoundingClientRect();
          const containerTop = containerRect.top;

          // Si le haut du composant est en dessous du haut de la fenêtre (donc hors de vue)
          // alors rendre la menu bar sticky
          setIsMenuBarSticky(containerTop < 0);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Vérifier immédiatement la position
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isEditingActivity]);
  // Réinitialiser l'état sticky quand on quitte le mode édition
  useEffect(() => {
    if (!isEditingActivity) {
      setIsMenuBarSticky(false);
    }
  }, [isEditingActivity]);

  return (
    <>
      <div className={`editor relative`} ref={menuContainerRef}>
        {editor ? (
          <MenuBar
            shouldHide={!isEditingActivity}
            editor={editor}
            isSticky={isMenuBarSticky}
          />
        ) : null}
        <EditorContent
          className={`editor__content${
            isEditingActivity ? " cursor-text mt-5" : " mt-5"
          }`}
          onClick={() => editor?.commands.focus()}
          editor={editor}
        />

        {onDeleteActivity && (
          <Can action="delete" object="lesson">
            <button
              type="button"
              className="btn btn-ghost absolute top-4 right-4 tooltip tooltip-left"
              data-tip="Supprimer l'activité"
              onClick={onDeleteActivity}
            >
              <Trash2 className="w-5 h-5 text-error" />
            </button>
          </Can>
        )}

        {onSave &&
          isEditingActivity &&
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
