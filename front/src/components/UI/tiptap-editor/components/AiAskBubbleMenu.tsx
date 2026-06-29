import { Editor } from "@tiptap/react";
import { MouseEvent, useContext, useEffect, useState } from "react";
import { BubbleMenu } from "@tiptap/react/menus";
import { EditorState, NodeSelection } from "@tiptap/pm/state";
import { Sparkles } from "lucide-react";
import { ChatbotContext } from "../../../../store/chatbotContext";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  editor: Editor;
  mode: "read" | "write" | "edit" | "activity_type_selection";
};

export const AiAskBubbleMenu = ({ editor, mode }: Props) => {
  const { setActivityTextSelection } = useContext(ChatbotContext);

  const [isVisible, setIsVisible] = useState(false);
  const [selectionKey, setSelectionKey] = useState("empty");

  const shouldShow = ({ state }: { state: EditorState }) => {
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
  };

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

          if (mode !== "read") return false;

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

  useEffect(() => {
    if (!editor) return;

    const updateReactState = () => {
      setIsVisible(shouldShow({ state: editor.state }));
      setSelectionKey(
        `${editor.state.selection.from}-${editor.state.selection.to}`,
      );
    };

    updateReactState();
    editor.on("transaction", updateReactState);

    return () => {
      editor.off("transaction", updateReactState);
    };
  }, [editor, mode]);

  return (
    <BubbleMenu
      className="z-10"
      updateDelay={200}
      editor={editor}
      shouldShow={shouldShow}
    >
      <AnimatePresence mode="popLayout">
        {isVisible && (
          <motion.button
            key={selectionKey}
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.2 }}
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
