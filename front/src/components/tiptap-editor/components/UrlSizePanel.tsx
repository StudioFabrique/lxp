import { Surface } from "../ui/Surface";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { TIPTAP_MENU_BAR_COLORS } from "../Menubar/MenuBarConfig";
import {
  useUrlEditorState,
  type UrlEditorSize,
} from "./useUrlEditorState";

export type UrlSizePanelProps = {
  initialUrl?: string;
  initialSize?: UrlEditorSize;
  onSetLink: (url: string, size?: UrlEditorSize) => void;
  iconName: string;
  urlPlaceholder: string;
  submitLabel: string;
};

export const UrlSizePanel = ({
  onSetLink,
  initialUrl,
  initialSize,
  iconName,
  urlPlaceholder,
  submitLabel,
}: UrlSizePanelProps) => {
  const state = useUrlEditorState({
    onSetLink,
    initialUrl,
    initialSize,
  });

  return (
    <Surface
      className={`flex flex-col p-2 ${TIPTAP_MENU_BAR_COLORS.background} ${TIPTAP_MENU_BAR_COLORS.text}`}
    >
      <form onSubmit={state.handleSubmit} className="flex items-center gap-2">
        <label className="flex items-center gap-2 p-2 rounded-lg bg-neutral-100/80 cursor-text">
          <Icon name={iconName} className="flex-none" />
          <input
            type="url"
            className="flex-1 bg-transparent outline-none min-w-[12rem] text-sm"
            placeholder={urlPlaceholder}
            value={state.url}
            onChange={state.onChange}
          />
        </label>

        <Button
          variant="primary"
          buttonSize="small"
          type="submit"
          disabled={!state.isValidUrl}
        >
          {submitLabel}
        </Button>
      </form>
      <div className="flex gap-2 mt-3">
        <Button
          variant={state.size === "small" ? "primary" : "secondary"}
          buttonSize="small"
          onClick={() => state.setSize("small")}
        >
          Petit
        </Button>
        <Button
          variant={state.size === "medium" ? "primary" : "secondary"}
          buttonSize="small"
          onClick={() => state.setSize("medium")}
        >
          Moyen
        </Button>
        <Button
          variant={state.size === "large" ? "primary" : "secondary"}
          buttonSize="small"
          onClick={() => state.setSize("large")}
        >
          Grand
        </Button>
      </div>
    </Surface>
  );
};
