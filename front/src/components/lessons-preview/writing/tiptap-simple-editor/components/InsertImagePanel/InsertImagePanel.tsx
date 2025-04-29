import {
  useState,
  useCallback,
  useMemo,
  useEffect,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Surface } from "../ui/Surface";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";

export type InsertImagePanelProps = {
  initialUrl?: string;
  onSetLink: (url: string, size?: "small" | "medium" | "large") => void;
  onClickButton?: () => void;
  onSetImageSize?: Dispatch<SetStateAction<"small" | "medium" | "large">>;
};

export const useInsertImageState = ({
  initialUrl,
  onSetLink,
}: InsertImagePanelProps) => {
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
    [url, isValidUrl, onSetLink, size],
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

export const InsertImagePanel = ({
  onSetLink,
  initialUrl,
  onClickButton,
  onSetImageSize,
}: InsertImagePanelProps) => {
  const state = useInsertImageState({
    onSetLink,
    initialUrl,
  });

  useEffect(() => {
    onSetImageSize?.(state.size);
  }, [state.size, onSetImageSize]);

  return (
    <Surface className="flex flex-col p-2">
      <form onSubmit={state.handleSubmit} className="flex items-center gap-2">
        <label className="flex items-center gap-2 p-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 cursor-text">
          <Icon name="Image" className="flex-none text-black dark:text-white" />
          <input
            type="url"
            className="flex-1 bg-transparent outline-none min-w-[12rem] text-black text-sm dark:text-white"
            placeholder="URL de l'image"
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
          Insérer l'image
        </Button>
      </form>
      <div className="flex items-center gap-2 my-2">
        <hr className="border-base-content/20 w-full" />
        OU
        <hr className="border-base-content/20 w-full" />
      </div>

      <Button
        onClick={onClickButton}
        variant="primary"
        buttonSize="small"
        type="button"
      >
        Téléverser une image depuis mon ordinateur
      </Button>
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
