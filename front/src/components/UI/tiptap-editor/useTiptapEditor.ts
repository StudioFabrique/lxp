import { Editor, useEditor } from "@tiptap/react";
import { useEffect, useRef, useState } from "react";
import { tiptapExtensions } from "./tiptapConfig";

export default function useTiptapEditor(
  className: string,
  editorRef: React.MutableRefObject<Editor | null>,
  isEditingActivity: boolean,
  initialValue?: string,
  onContentChange?: (content: string) => void,
) {
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
      if (onContentChange && isEditingActivity) {
        onContentChange(editor.getHTML());
      }
    },
  });

  const [isMenuBarSticky, setIsMenuBarSticky] = useState(false);

  // Ref pour le conteneur principal
  const menuContainerRef = useRef<HTMLDivElement>(null);
  // Ref pour la sentinelle invisible
  const stickyMarkerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editor) {
      editorRef.current = editor;
    }
  }, [editor, editorRef]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditingActivity);
    }
  }, [editor, isEditingActivity]);

  useEffect(() => {
    if (editor && editor.getHTML() !== initialValue) {
      editor.commands.setContent(initialValue || "");
    }
  }, [editor, initialValue]);

  // --- LOGIQUE MENU BAR STICKY (Utilisation de IntersectionObserver) ---
  useEffect(() => {
    if (!isEditingActivity || !stickyMarkerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsMenuBarSticky(
          !entry.isIntersecting && entry.boundingClientRect.top < 0,
        );
      },
      {
        root: null,
        threshold: 0.5,
        rootMargin: "-10px 0px 0px 0px",
      },
    );

    observer.observe(stickyMarkerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isEditingActivity]);

  return {
    editor,
    menuContainerRef,
    stickyMarkerRef,
    isMenuBarSticky,
  };
}
