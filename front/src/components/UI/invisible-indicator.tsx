import { EyeOff } from "lucide-react";

type InvisibleIndicatorProps = {
  label?: string;
};

const InvisibleIndicator = ({
  label = "Élément invisible",
}: InvisibleIndicatorProps) => (
  <span className="inline-flex opacity-50" role="img" aria-label={label}>
    <EyeOff className="size-4" aria-hidden="true" />
  </span>
);

export default InvisibleIndicator;
