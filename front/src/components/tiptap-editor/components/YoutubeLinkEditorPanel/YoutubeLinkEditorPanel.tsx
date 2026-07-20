import { UrlSizePanel } from "../UrlSizePanel";

export type YoutubeLinkEditorPanelProps = {
  initialUrl?: string;
  onSetLink: (url: string, size?: "small" | "medium" | "large") => void;
};

export const YoutubeLinkEditorPanel = ({
  onSetLink,
  initialUrl,
}: YoutubeLinkEditorPanelProps) => {
  return (
    <UrlSizePanel
      onSetLink={onSetLink}
      initialUrl={initialUrl}
      initialSize="small"
      iconName="Link"
      urlPlaceholder="URL de la vidéo"
      submitLabel="Insérer la vidéo"
    />
  );
};
