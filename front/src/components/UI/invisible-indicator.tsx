import { EyeOff } from "lucide-react";

export default function InvisibleIndicator({
  label = "Cours invisible",
}: {
  label?: string;
}) {
  return (
    <span role="img" className="opacity-50" aria-label={label}>
      <EyeOff className="size-4" aria-hidden="true" />
    </span>
  );
}
