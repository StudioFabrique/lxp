type Props = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  url: string;
};

export default function ResourceIFramePreview({
  isLoading,
  setIsLoading,
  url,
}: Props) {
  return (
    <iframe
      src={url}
      title="Iframe Activity"
      className="w-full h-[500px] rounded-lg border border-primary/30"
      allowFullScreen
      onLoad={() => setIsLoading(false)}
      hidden={isLoading}
    />
  );
}
