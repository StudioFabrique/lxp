import "./MenuBar.scss";
import type { Editor } from "@tiptap/react";

import { Fragment, memo, useRef } from "react";

import MenuItem from "./MenuItem.jsx";
import { ContentTypePicker } from "./dropdowns/ContentTypePicker.js";
import { useMenuTextTypes } from "./hooks/useMenuTextTypes.js";
import { items } from "./MenuBarItems.js";
import { useMenuContentTypes } from "./hooks/useMenuContentTypes.js";
import { useMenuAlignTextTypes } from "./hooks/useMenuAlignTextTypes.js";
import { ColorPicker } from "./Colorpicker/Colorpicker.js";
import { useTextmenuCommands } from "./hooks/useTextMenuCommands.js";

type MenuBarProps = {
  editor: Editor;
  onCloseEditor: () => void;
};

const MemoContentTypePicker = memo(ContentTypePicker);
const MemoColorPicker = memo(ColorPicker);

export default function MenuBar({ editor, onCloseEditor }: MenuBarProps) {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const menuContentOptions = useMenuContentTypes(editor, inputFileRef);

  const menuTextOptions = useMenuTextTypes(editor);

  const menuAlignTextOptions = useMenuAlignTextTypes(editor);
  const commands = useTextmenuCommands(editor);
  const states = useTextmenuStates(editor);

  return (
    <div className="editor__header px-4 flex justify-between items-center bg-base-200 border-primary/50 border-[1px] rounded-t-xl">
      <MemoContentTypePicker options={menuContentOptions} fixedIcon="Plus" />

      <div className="flex items-center flex-auto flex-wrap">
        <MemoContentTypePicker options={menuTextOptions} />
        <MemoContentTypePicker
          options={menuAlignTextOptions}
          fixedIcon="AlignLeft"
        />
        <MemoColorPicker
          color={states.currentHighlight}
          onChange={commands.onChangeHighlight}
          onClear={commands.onClearHighlight}
        />
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

      <input
        ref={inputFileRef}
        className="hidden"
        type="file"
        accept="image/*"
      />
    </div>
  );
}
