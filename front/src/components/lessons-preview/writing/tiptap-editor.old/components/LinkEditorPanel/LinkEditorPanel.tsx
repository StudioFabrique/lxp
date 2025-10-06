import { useState, useCallback, useMemo } from "react";
import { Surface } from "../ui/Surface";
import { Icon } from "../ui/Icon";
import { Button } from "../ui/Button";
import { Toggle } from "../ui/Toggle";

export type LinkEditorPanelProps = {
  initialUrl?: string;
  initialOpenInNewTab?: boolean;
  onSetLink: (url: string, openInNewTab?: boolean) => void;
};

export const useLinkEditorState = ({
  initialUrl,
  initialOpenInNewTab,
  onSetLink,
}: LinkEditorPanelProps) => {
  const [url, setUrl] = useState(initialUrl || "");
  const [openInNewTab, setOpenInNewTab] = useState(
    initialOpenInNewTab || false
  );

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  }, []);

  const isValidUrl = useMemo(() => /^(\S+):(\/\/)?\S+$/.test(url), [url]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (isValidUrl) {
        onSetLink(url, openInNewTab);
      }
    },
    [url, isValidUrl, openInNewTab, onSetLink]
  );

  return {
    url,
    setUrl,
    openInNewTab,
    setOpenInNewTab,
    onChange,
    handleSubmit,
    isValidUrl,
  };
};

export const LinkEditorPanel = ({
  onSetLink,
  initialOpenInNewTab,
  initialUrl,
}: LinkEditorPanelProps) => {
  const state = useLinkEditorState({
    onSetLink,
    initialOpenInNewTab,
    initialUrl,
  });

  return (
    <Surface className="p-2">
      <form onSubmit={state.handleSubmit} className="flex items-center gap-2">
        <label className="flex items-center gap-2 p-2 rounded-lg bg-neutral-100/20 cursor-text">
          <Icon name="Link" className="flex-none text-black dark:text-white" />
          <input
            type="url"
            className="flex-1 bg-transparent outline-none min-w-[12rem] text-black text-sm dark:text-white"
            placeholder="URL du lien"
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
          Insérer le lien
        </Button>
      </form>
      <div className="mt-3">
        <label className="flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer select-none text-base-content">
          Ouvrir dans un nouvel onglet
          <Toggle
            active={state.openInNewTab}
            onChange={state.setOpenInNewTab}
          />
        </label>
      </div>
    </Surface>
  );
};
