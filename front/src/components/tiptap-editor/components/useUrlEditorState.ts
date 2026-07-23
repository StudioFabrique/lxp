import { useCallback, useMemo, useState } from "react";

export type UrlEditorSize = "small" | "medium" | "large";

export type UseUrlEditorStateProps = {
  initialUrl?: string;
  initialSize?: UrlEditorSize;
  onSetLink: (url: string, size?: UrlEditorSize) => void;
};

export const useUrlEditorState = ({
  initialUrl,
  initialSize = "medium",
  onSetLink,
}: UseUrlEditorStateProps) => {
  const [url, setUrl] = useState(initialUrl || "");
  const [size, setSize] = useState<UrlEditorSize>(initialSize);

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
