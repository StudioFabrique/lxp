import { useEffect, type Dispatch, type SetStateAction } from "react";
import { Button } from "../ui/Button";
import { UrlSizePanel } from "../UrlSizePanel";
import { useUrlEditorState } from "../useUrlEditorState";

export type InsertImagePanelProps = {
  initialUrl?: string;
  onSetLink: (url: string, size?: "small" | "medium" | "large") => void;
  onClickUpload?: () => void;
  onSetImageSize?: Dispatch<SetStateAction<"small" | "medium" | "large">>;
};

export const InsertImagePanel = ({
  onSetLink,
  initialUrl,
  onClickUpload,
  onSetImageSize,
}: InsertImagePanelProps) => {
  const state = useUrlEditorState({
    onSetLink,
    initialUrl,
  });

  useEffect(() => {
    onSetImageSize?.(state.size);
  }, [state.size, onSetImageSize]);

  return (
    <div className="flex flex-col">
      <UrlSizePanel
        onSetLink={onSetLink}
        initialUrl={initialUrl}
        iconName="Image"
        urlPlaceholder="URL de l'image"
        submitLabel="Insérer l'image"
      />
      <div className="flex items-center gap-2 my-2 px-2">
        <hr className="border-base-content/20 w-full" />
        <span className="text-base-content">OU</span>
        <hr className="border-base-content/20 w-full" />
      </div>

      <div className="px-2">
        <Button
          onClick={onClickUpload}
          variant="primary"
          buttonSize="small"
          type="button"
        >
          Téléverser une image depuis mon ordinateur
        </Button>
      </div>
    </div>
  );
};
