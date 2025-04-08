import { EditorInfo } from "./EditorInfo";
import { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import { useCallback } from "react";
import { Toolbar } from "../../ui/Toolbar";
import { Icon } from "../../ui/Icon";

export type EditorHeaderProps = {
  isSidebarOpen?: boolean;
  toggleSidebar?: () => void;
  editor: Editor;
};

export const EditorHeader = ({
  editor,
  isSidebarOpen,
  toggleSidebar,
}: EditorHeaderProps) => {
  const { characters, words } = useEditorState({
    editor,
    selector: (ctx) => {
      const { characters, words } = ctx.editor?.storage.characterCount || {
        characters: () => 0,
        words: () => 0,
      };
      return {
        characters: characters(),
        words: words(),
      };
    },
  });

  const toggleEditable = useCallback(() => {
    editor.setOptions({ editable: !editor.isEditable });
    editor.view.dispatch(editor.view.state.tr);
  }, [editor]);

  return (
    <div className="flex items-center justify-between py-2 px-3 border-b border-neutral-200">
      <div className="flex items-center gap-1.5">
        <Toolbar.Button
          tooltip={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          onClick={toggleSidebar}
          active={isSidebarOpen}
        >
          <Icon name={isSidebarOpen ? "PanelLeftClose" : "PanelLeft"} />
        </Toolbar.Button>
        <Toolbar.Button
          tooltip={editor.isEditable ? "Disable editing" : "Enable editing"}
          onClick={toggleEditable}
        >
          <Icon name={editor.isEditable ? "PenOff" : "Pen"} />
        </Toolbar.Button>
      </div>
      <EditorInfo characters={characters} words={words} />
    </div>
  );
};
