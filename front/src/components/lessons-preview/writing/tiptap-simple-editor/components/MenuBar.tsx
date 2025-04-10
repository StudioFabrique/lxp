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
import { useTextmenuStates } from "./hooks/useTextmenuStates.js";
import { useTextmenuCommands } from "./hooks/useTextmenuCommands.js";
import * as Popover from "@radix-ui/react-popover";
import { Toolbar } from "./ui/Toolbar.js";
import { Icon } from "./ui/Icon.js";
import { Surface } from "./ui/Surface.js";
import { FontFamilyPicker } from "./FontFamilyPicker.js";
import { EditLinkPopover } from "./EditLinkPopover.js";
import { EditYoutubeLinkPopover } from "./EditYoutubeLinkPopover.js";

type MenuBarProps = {
  editor: Editor;
  onCloseEditor: () => void;
};

const MemoButton = memo(Toolbar.Button);
const MemoContentTypePicker = memo(ContentTypePicker);
const MemoColorPicker = memo(ColorPicker);
const MemoFontFamilyPicker = memo(FontFamilyPicker);
// const MemoFontSizePicker = memo(FontSizePicker);

export default function MenuBar({ editor, onCloseEditor }: MenuBarProps) {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const menuContentOptions = useMenuContentTypes(editor, inputFileRef);

  const menuTextOptions = useMenuTextTypes(editor);

  const menuAlignTextOptions = useMenuAlignTextTypes(editor);
  const commands = useTextmenuCommands(editor);
  const states = useTextmenuStates(editor);

  return (
    <Toolbar.Wrapper className="h-fit flex justify-between px-2">
      <MemoContentTypePicker options={menuContentOptions} fixedIcon="Plus" />
      <EditLinkPopover onSetLink={commands.onLink} />
      <EditYoutubeLinkPopover onSetLink={commands.onYoutubeLink} />
      <MemoContentTypePicker options={menuTextOptions} />
      <MemoContentTypePicker
        options={menuAlignTextOptions}
        fixedIcon="AlignLeft"
      />
      <MemoFontFamilyPicker
        onChange={commands.onSetFont}
        value={states.currentFont || ""}
      />
      {/* <MemoFontSizePicker
        onChange={commands.onSetFontSize}
        value={states.currentSize || ""}
      /> */}

      <Popover.Root>
        <Popover.Trigger asChild>
          <MemoButton
            active={!!states.currentHighlight}
            tooltip="Highlight text"
          >
            <Icon name="Highlighter" />
          </MemoButton>
        </Popover.Trigger>
        <Popover.Content side="top" sideOffset={8} asChild>
          <Surface className="p-1">
            <MemoColorPicker
              color={states.currentHighlight}
              onChange={commands.onChangeHighlight}
              onClear={commands.onClearHighlight}
            />
          </Surface>
        </Popover.Content>
      </Popover.Root>
      <Popover.Root>
        <Popover.Trigger asChild>
          <MemoButton active={!!states.currentColor} tooltip="Text color">
            <Icon name="Palette" />
          </MemoButton>
        </Popover.Trigger>
        <Popover.Content side="top" sideOffset={8} asChild>
          <Surface className="p-1">
            <MemoColorPicker
              color={states.currentColor}
              onChange={commands.onChangeColor}
              onClear={commands.onClearColor}
            />
          </Surface>
        </Popover.Content>
      </Popover.Root>
      {items(editor).map((item, index) => (
        <Fragment key={index}>
          {item.type === "divider" ? (
            <span className="divider" />
          ) : (
            <MenuItem {...item} />
          )}
        </Fragment>
      ))}
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
    </Toolbar.Wrapper>
  );
}
