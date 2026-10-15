import { Editor } from "@tiptap/react";
import {
  MouseEvent,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { BubbleMenu } from "@tiptap/react/menus";
import { EditorState, NodeSelection } from "@tiptap/pm/state";
import { Sparkles, X } from "lucide-react";
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

  // Point d'ancrage : l'emprise visuelle de toute la sélection (toutes ses lignes), pour centrer l'infobulle sur le texte.
  // Par défaut, Tiptap n'utilise que les positions de début et de fin, ce qui décale l'infobulle sur un texte à plusieurs lignes.
  const getSelectionReference = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    const range = selection.getRangeAt(0);
    const bounds = range.getBoundingClientRect();
    if (bounds.width === 0 && bounds.height === 0) return null;
    return {
      getBoundingClientRect: () => range.getBoundingClientRect(),
      getClientRects: () => range.getClientRects(),
    };
  }, []);

  // Referme l'infobulle en retirant la sélection (le texte reste intact).
  const handleClose = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    editor.commands.setTextSelection(editor.state.selection.to);
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
              // Au doigt, un nouvel appui sur le bloc déjà sélectionné referme l'infobulle.
              if (window.matchMedia?.("(pointer: coarse)").matches) {
                editor.commands.setTextSelection(end);
                return true;
              }
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
      getReferencedVirtualElement={getSelectionReference}
    >
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="btn btn-primary flex items-center gap-2 shadow-lg"
          onMouseDown={(event) => event.preventDefault()}
          onClick={handleClick}
        >
          <Sparkles className="w-4 h-4" />
          <span>Demander à l'assistant</span>
        </button>
        <button
          type="button"
          className="btn btn-circle btn-sm bg-base-100 shadow-lg"
          onMouseDown={(event) => event.preventDefault()}
          onClick={handleClose}
          aria-label="Fermer"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </BubbleMenu>
  );
};
