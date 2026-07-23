import { Editor, useEditor, useEditorState } from "@tiptap/react";
import { useContext, useEffect, useRef, useState } from "react";
import { tiptapExtensions } from "./tiptapConfig";
import { ChatbotContext } from "../../store/ChatbotProvider";
import { calculateTextReadTime } from "./utils/activity-read-time-helper";

export default function useTiptapEditor(
  className: string,
  editorRef: React.MutableRefObject<Editor | null>,
  isEditingActivity: boolean,
  initialValue?: string,
  onContentChange?: (content: string) => void,
) {
  const { setCurrentActivity } = useContext(ChatbotContext);

  const [readTimeMinutes, setReadTimeMinutes] = useState<number>(0);

  const [isMenuBarSticky, setIsMenuBarSticky] = useState(false);

  const menuContainerRef = useRef<HTMLDivElement>(null);
  const stickyMarkerRef = useRef<HTMLDivElement>(null);

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

  const { wordsCount } = useEditorState({
    editor,
    selector: (context) => ({
      wordsCount: context.editor?.storage.characterCount.words(),
    }),
  }) as { wordsCount: number };

  useEffect(() => {
    if (editor) {
      editorRef.current = editor;
    }
  }, [editor, editorRef]);

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      queueMicrotask(() => {
        if (editor.isEditable !== isEditingActivity) {
          editor.setEditable(isEditingActivity);
        }
      });
    }
  }, [editor, isEditingActivity]);

  useEffect(() => {
    if (editor && !editor.isDestroyed && editor.getHTML() !== initialValue) {
      queueMicrotask(() => {
        editor.commands.setContent(initialValue || "");
      });
    }
  }, [editor, initialValue]);

  useEffect(() => {
    const { readTimeMs, readTimeMinutes } = calculateTextReadTime(wordsCount);
    setCurrentActivity((prev) => prev && { ...prev, readTimeMs });
    setReadTimeMinutes(readTimeMinutes);
  }, [setCurrentActivity, wordsCount]);

  // Menu sticky
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
        threshold: 0.1,
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
    readTimeMinutes,
  };
}
