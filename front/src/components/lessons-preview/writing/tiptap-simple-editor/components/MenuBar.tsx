import "./MenuBar.scss";
import type { Editor } from "@tiptap/react";

import { Fragment, memo } from "react";

import MenuItem from "./MenuItem.jsx";
import { ContentTypePicker } from "./dropdowns/ContentTypePicker.js";
import { useMenuTextTypes } from "./hooks/useMenuTextTypes.js";
import { items } from "./MenuBarItems.js";
import { useMenuContentTypes } from "./hooks/useMenuContentTypes.js";

type MenuBarProps = {
  editor: Editor;
  onCloseEditor: () => void;
};

const MemoContentTypePicker = memo(ContentTypePicker);

export default function MenuBar({ editor, onCloseEditor }: MenuBarProps) {
  const menuTextOptions = useMenuTextTypes(editor);
  const menuContentOptions = useMenuContentTypes(editor);

  return (
    <div className="editor__header px-4 flex justify-between items-center bg-base-200 border-base-content border-2 rounded-t-xl">
      <MemoContentTypePicker options={menuContentOptions} fixedIcon="Plus" />

      <div className="flex items-center flex-auto flex-wrap">
        <MemoContentTypePicker options={menuTextOptions} />
        {items(editor).map((item, index) => (
          <Fragment key={index}>
            {item.type === "divider" ? (
              <span className="divider" />
            ) : (
              <MenuItem {...item} />
            )}
          </Fragment>
        ))}
      </div>
      <MenuItem
        icon="close-large-line"
        title="Fermer l'éditeur"
        action={onCloseEditor}
      />
    </div>
  );
}
