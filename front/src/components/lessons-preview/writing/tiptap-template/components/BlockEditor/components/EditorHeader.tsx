import { EditorInfo } from "./EditorInfo";
import { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import { useCallback } from "react";
import { Toolbar } from "../../ui/Toolbar";
import { Icon } from "../../ui/Icon";

export type EditorHeaderProps = {
  editor: Editor;
  onCloseEditor: () => void;
  // isSidebarOpen?: boolean;
  // toggleSidebar?: () => void;
};

export const EditorHeader = ({
  editor,
  onCloseEditor,
  // isSidebarOpen,
  // toggleSidebar,
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
        {/* <Toolbar.Button
          tooltip={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          onClick={toggleSidebar}
          active={isSidebarOpen}
        >
          <Icon name={isSidebarOpen ? "PanelLeftClose" : "PanelLeft"} />
        </Toolbar.Button> */}

        <Toolbar.Button
          tooltip={
            editor.isEditable
              ? "Désactiver le mode edition"
              : "Activer le mode édition"
          }
          onClick={toggleEditable}
        >
          <Icon name={editor.isEditable ? "Lock" : "Pen"} />
        </Toolbar.Button>
      </div>
      <div className="flex gap-1.5">
        <EditorInfo characters={characters} words={words} />
        <Toolbar.Button tooltip="Fermer l'éditeur" onClick={onCloseEditor}>
          <Icon name="X" />
        </Toolbar.Button>
      </div>
    </div>
  );
};
