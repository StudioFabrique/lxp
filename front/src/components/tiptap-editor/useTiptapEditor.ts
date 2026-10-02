import { Editor, useEditor, useEditorState } from "@tiptap/react";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { tiptapExtensions } from "./tiptapConfig";
import { ChatbotContext } from "../../store/ChatbotProvider";
import { calculateActivityReadTime } from "./utils/activity-read-time-helper";

export default function useTiptapEditor(
  className: string,
  editorRef: React.MutableRefObject<Editor | null>,
  isEditingActivity: boolean,
  initialValue?: string,
  onContentChange?: (content: string) => void,
) {
  const { setCurrentActivity } = useContext(ChatbotContext);

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

  const { content } = useEditorState({
    editor,
    selector: (context) => ({
      content: context.editor?.getHTML(),
    }),
  }) as { content?: string };
  const { readTimeMs, readTimeMinutes } = useMemo(
    () => calculateActivityReadTime(content),
    [content],
  );

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
    setCurrentActivity((prev) => prev && { ...prev, readTimeMs });
  }, [setCurrentActivity, readTimeMs]);

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
        threshold: 0.6,
        rootMargin: "50px 0px 0px 0px",
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
