import { useId, type ReactNode } from "react";
import { ShieldCheck } from "lucide-react";
import { cn } from "../../../utils/cn";
import { roleModelIcons } from "../helpers/role-models";

type RoleRadioCardProps = {
  name: string;
  value: string | number;
  rank: number;
  label: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  description?: ReactNode;
  invalid?: boolean;
  describedBy?: string;
};

export default function RoleRadioCard({
  name, value, rank, label, checked, onChange, disabled = false,
  description, invalid, describedBy,
}: RoleRadioCardProps) {
  const id = useId();
  const Icon = roleModelIcons[rank] ?? ShieldCheck;

  return (
    <label
      htmlFor={id}
      className={cn(
        "card flex-row items-center gap-3 border p-4 transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary",
        checked ? "border-primary bg-primary/10" : "border-base-300 bg-base-100",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-primary",
      )}
    >
      <Icon className="size-6 shrink-0 text-primary" aria-hidden="true" />
      <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">
        <span className="block text-sm font-medium first-letter:uppercase">{label}</span>
        {description ? <span className="mt-1 block text-xs text-base-content/70">{description}</span> : null}
      </span>
      <input
        id={id}
        name={name}
        type="radio"
        value={value}
        className="radio radio-primary radio-sm shrink-0"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
      />
    </label>
  );
}
