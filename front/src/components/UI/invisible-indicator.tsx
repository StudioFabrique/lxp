import { EyeOff } from "lucide-react";

export default function InvisibleIndicator() {
  return (
    <span role="img" className="opacity-50" aria-label="Cours invisible">
      <EyeOff className="size-4" aria-hidden="true" />
    </span>
  );
}
