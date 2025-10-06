import { Editor, useEditor } from "@tiptap/react";
import { useEffect, useRef, useState } from "react";
import { tiptapExtensions } from "./tiptapConfig";

export default function useTiptapEditor(
  className: string,
  editorRef: React.MutableRefObject<Editor | null>,
  isEditingActivity: boolean,
  initialValue?: string,
  onContentChange?: (content: string) => void
) {
  const [isMenuBarSticky, setIsMenuBarSticky] = useState(false);

  const editor = useEditor({
    extensions: tiptapExtensions,
    content: initialValue,
    editable: isEditingActivity,
    editorProps: {
      attributes: {
        class: className,
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

  return {
    editor,
    menuContainerRef,
    isMenuBarSticky,
  };
}
