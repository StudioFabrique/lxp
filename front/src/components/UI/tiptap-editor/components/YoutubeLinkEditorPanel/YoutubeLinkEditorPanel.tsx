import { useState, useCallback, useMemo } from "react";
import { Surface } from "../ui/Surface";
import { Icon } from "../ui/Icon";
import { Button } from "../ui/Button";
import { TIPTAP_MENU_BAR_COLORS } from "../Menubar/MenuBarConfig";

export type YoutubeLinkEditorPanelProps = {
  initialUrl?: string;
  initialOpenInNewTab?: boolean;
  onSetLink: (url: string, size?: "small" | "medium" | "large") => void;
};

export const useYoutubeLinkEditorState = ({
  initialUrl,
  onSetLink,
}: YoutubeLinkEditorPanelProps) => {
  const [url, setUrl] = useState(initialUrl || "");
  const [size, setSize] = useState<"small" | "medium" | "large">("small");

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  }, []);

  const isValidUrl = useMemo(() => /^(\S+):(\/\/)?\S+$/.test(url), [url]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (isValidUrl) {
        onSetLink(url, size);
      }
    },
    [url, isValidUrl, onSetLink, size]
  );

  return {
    url,
    setUrl,
    size,
    setSize,
    onChange,
    handleSubmit,
    isValidUrl,
  };
};

export const YoutubeLinkEditorPanel = ({
  onSetLink,
  initialOpenInNewTab,
  initialUrl,
}: YoutubeLinkEditorPanelProps) => {
  const state = useYoutubeLinkEditorState({
    onSetLink,
    initialOpenInNewTab,
    initialUrl,
  });

  return (
    <Surface
      className={`flex flex-col p-2 ${TIPTAP_MENU_BAR_COLORS.background} ${TIPTAP_MENU_BAR_COLORS.text}`}
    >
      <form onSubmit={state.handleSubmit} className="flex items-center gap-2">
        <label className="flex items-center gap-2 p-2 rounded-lg bg-neutral-100/80 cursor-text">
          <Icon name="Link" className="flex-none" />
          <input
            type="url"
            className="flex-1 bg-transparent outline-none min-w-[12rem]"
            placeholder="URL de la vidéo"
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
          Insérer la vidéo
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
