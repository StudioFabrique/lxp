import { Editor } from "@tiptap/react";
import {
  MouseEvent,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { BubbleMenu } from "@tiptap/react/menus";
import { EditorState, NodeSelection } from "@tiptap/pm/state";
import { Sparkles } from "lucide-react";
import { ChatbotContext } from "../../../store/ChatbotProvider";

type Props = {
  editor: Editor;
  mode: "read" | "write" | "edit" | "activity_type_selection";
};

export const AiAskBubbleMenu = ({ editor, mode }: Props) => {
  const { setActivityTextSelection } = useContext(ChatbotContext);

  const shouldShow = useCallback(({ state }: { state: EditorState }) => {
    if (mode !== "read" || !state) return false;

    const { from, to, empty } = state.selection;
    if (empty || from === to) return false;

    const selectedText = state.doc.textBetween(from, to, "\n").trim();
    if (selectedText.length === 0) return false;

    if (editor.isActive("video")) return false;

    if (
      state.selection instanceof NodeSelection &&
      state.selection.node.type.name === "video"
    ) {
      return false;
    }

    return true;
  }, [editor, mode]);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to, "\n");
    setActivityTextSelection(text);
    // Réinitialisation de la selection pour
    editor.commands.setTextSelection(0);
  };

  useEffect(() => {
    if (!editor) return;

    const previousHandleClick = editor.options.editorProps?.handleClick;

    editor.setOptions({
      editorProps: {
        ...editor.options.editorProps,
        handleClick: (view, pos, event) => {
          if (previousHandleClick && previousHandleClick(view, pos, event)) {
            return true;
          }

          if (mode !== "read" || !view.state.selection.empty) return false;

          const $pos = view.state.doc.resolve(pos);
          const blockNode = $pos.parent;

          if (
            blockNode &&
            blockNode.isBlock &&
            blockNode.textContent.trim().length > 0 &&
            blockNode.type.name !== "video"
          ) {
            const start = $pos.start();
            const end = $pos.end();

            if (
              view.state.selection.from === start &&
              view.state.selection.to === end
            ) {
              return false;
            }

            editor.commands.setTextSelection({ from: start, to: end });
            return true;
          }

          return false;
        },
      },
    });

    return () => {
      if (editor && !editor.isDestroyed) {
        editor.setOptions({
          editorProps: {
            ...editor.options.editorProps,
            handleClick: previousHandleClick,
          },
        });
      }
    };
  }, [editor, mode]);

  return (
    <BubbleMenu
      className="z-10"
      updateDelay={200}
      editor={editor}
      shouldShow={shouldShow}
    >
      <button
        type="button"
        className="btn btn-primary flex items-center gap-2 shadow-lg"
        onMouseDown={(event) => event.preventDefault()}
        onClick={handleClick}
      >
        <Sparkles className="w-4 h-4" />
        <span>Demander à l'assistant</span>
      </button>
    </BubbleMenu>
  );
};
