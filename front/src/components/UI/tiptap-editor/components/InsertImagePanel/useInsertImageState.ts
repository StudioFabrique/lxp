import { useCallback, useMemo, useState } from "react";

export type InsertImagePanelProps = {
  initialUrl?: string;
  onSetLink: (url: string, size?: "small" | "medium" | "large") => void;
};

export const useInsertImageState = ({
  initialUrl,
  onSetLink,
}: InsertImagePanelProps) => {
  const [url, setUrl] = useState(initialUrl || "");
  const [size, setSize] = useState<"small" | "medium" | "large">("medium");

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
