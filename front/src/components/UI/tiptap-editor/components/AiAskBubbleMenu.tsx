import { BubbleMenu, Editor } from "@tiptap/react";
import { Sparkles } from "lucide-react";
import { MouseEvent, useContext, useEffect } from "react";
import { ChatbotContext } from "../../../../store/chatbotContext";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  editor: Editor;
  mode: "read" | "write" | "edit" | "activity_type_selection";
};

export const AiAskBubbleMenu = ({ editor, mode }: Props) => {
  const { setActivityTextSelection } = useContext(ChatbotContext);

  const shouldShow = ({
    state,
  }: {
    state: { selection: { empty: boolean } };
  }) => {
    if (mode === "read") {
      return !state.selection.empty;
    }
    return false;
  };

  // Définir si le menu doit être visible
  const isVisible = editor && shouldShow({ state: editor.state });

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to, "\n");
    setActivityTextSelection(text);
    // Réinitialisation de la selection pour
    editor.commands.setTextSelection(0);
  };

  // Créer une clé unique basée sur les coordonnées de la sélection
  const selectionKey = editor
    ? `${editor.state.selection.from}-${editor.state.selection.to}`
    : "empty";

  useEffect(() => {
    if (!editor) return;
    const previousHandleClick = editor.options.editorProps.handleClick;

    editor.setOptions({
      editorProps: {
        ...editor.options.editorProps,
        handleClick: (view, pos, event) => {
          if (previousHandleClick && previousHandleClick(view, pos, event)) {
            return true;
          }

          if (mode !== "read") return false;

          const $pos = view.state.doc.resolve(pos);
          const blockNode = $pos.parent;

          if (
            blockNode &&
            blockNode.isBlock &&
            blockNode.textContent.trim().length > 0
          ) {
            const start = $pos.start();
            const end = $pos.end();

            editor.commands.setTextSelection({ from: start, to: end });
            return true;
          }

          return false;
        },
      },
    });
  }, [editor, mode]);

  return (
    <BubbleMenu
      className="z-10"
      tippyOptions={{
        zIndex: 10,
      }}
      editor={editor}
      shouldShow={shouldShow}
    >
      <AnimatePresence mode="popLayout">
        {isVisible && (
          <motion.button
            key={selectionKey}
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 25,
            }}
            className="btn btn-primary flex items-center gap-2 shadow-lg"
            onClick={handleClick}
          >
            <Sparkles className="w-4 h-4" />
            <span>Demander à l'assistant</span>
          </motion.button>
        )}
      </AnimatePresence>
    </BubbleMenu>
  );
};
