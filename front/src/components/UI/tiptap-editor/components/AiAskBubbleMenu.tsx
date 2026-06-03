import { BubbleMenu, Editor } from "@tiptap/react";
import { Sparkles } from "lucide-react";
import { useContext, useEffect } from "react";
import { ChatbotContext } from "../../../../store/chatbotContext";

type Props = {
  editor: Editor;
  mode: "read" | "write" | "edit" | "activity_type_selection";
};

export const AiAskBubbleMenu = ({ editor, mode }: Props) => {
  const { setActivityTextSelection } = useContext(ChatbotContext);

  const handleAsk = (textSelection: string) => {
    setActivityTextSelection(textSelection);
  };

  useEffect(() => {
    if (!editor) return;
    const previousHandleClick = editor.options.editorProps.handleClick;

    editor.setOptions({
      editorProps: {
        ...editor.options.editorProps,
        handleClick: (view, pos, event) => {
          // 1. Exécuter le comportement précédent si existant
          if (previousHandleClick && previousHandleClick(view, pos, event)) {
            return true;
          }

          // 2. Si on n'est pas en mode lecture, on laisse Tiptap gérer normalement
          if (mode !== "read") return false;

          // 3. Résoudre la position du clic dans le document
          const $pos = view.state.doc.resolve(pos);
          const blockNode = $pos.parent;

          // 4. Si on a bien cliqué sur un bloc valide et non vide (ex: Paragraphe, Titre)
          if (
            blockNode &&
            blockNode.isBlock &&
            blockNode.textContent.trim().length > 0
          ) {
            const start = $pos.start();
            const end = $pos.end();

            // 5. Sélectionner tout le texte du bloc programmatiquement
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
      editor={editor}
      // Surcharger les règles strictes de Tiptap
      shouldShow={({ state }) => {
        if (mode === "read") {
          // En mode lecture, on l'affiche s'il y a une sélection de texte
          return !state.selection.empty;
        }
        return false; // Ou modifie cette ligne si tu veux aussi le menu en mode "write"
      }}
    >
      <button
        className="btn btn-primary"
        onClick={(e) => {
          e.preventDefault();

          // Récupérer la sélection courante
          const { from, to } = editor.state.selection;

          // Extraire le texte brut situé entre ces coordonnées
          const text = editor.state.doc.textBetween(from, to, "\n");

          // Passer le texte au handle externe
          handleAsk(text);
        }}
      >
        <Sparkles className="w-5" /> Demander à l'IA
      </button>
    </BubbleMenu>
  );
};
