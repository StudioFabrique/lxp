import { useCallback, useState, JSX } from "react";
import { Editor, useEditorState } from "@tiptap/react";
import { BubbleMenu as BaseBubbleMenu } from "@tiptap/react/menus";
import { LinkEditorPanel } from "../LinkEditorPanel";
import { LinkPreviewPanel } from "../LinkPreviewPanel";

interface MenuProps {
  editor: Editor;
}

const LinkMenu = ({ editor }: MenuProps): JSX.Element => {
  const [showEdit, setShowEdit] = useState(false);

  const { link, target } = useEditorState({
    editor,
    selector: (ctx) => {
      const attrs = ctx.editor.getAttributes("link");
      return { link: attrs.href, target: attrs.target };
    },
  });

  const shouldShow = useCallback(() => {
    return editor.isActive("link");
  }, [editor]);

  const handleEdit = useCallback(() => {
    setShowEdit(true);
  }, []);

  const onSetLink = useCallback(
    (url: string, openInNewTab?: boolean) => {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url, target: openInNewTab ? "_blank" : "" })
        .run();
      setShowEdit(false);
    },
    [editor],
  );

  const onUnsetLink = useCallback(() => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setShowEdit(false);
  }, [editor]);

  return (
    <BaseBubbleMenu
      editor={editor}
      pluginKey="textMenu"
      shouldShow={shouldShow}
    >
      {showEdit ? (
        <LinkEditorPanel
          initialUrl={link}
          initialOpenInNewTab={target === "_blank"}
          onSetLink={onSetLink}
        />
      ) : (
        <LinkPreviewPanel
          url={link}
          onClear={onUnsetLink}
          onEdit={handleEdit}
        />
      )}
    </BaseBubbleMenu>
  );
};

export default LinkMenu;
