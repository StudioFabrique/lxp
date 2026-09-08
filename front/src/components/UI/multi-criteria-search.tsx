import { useState, type ReactNode } from "react";
import { Search, X } from "lucide-react";

type MultiCriteriaSearchProps = {
  value: string;
  onChange: (value: string) => void;
  criteria: string[];
  placeholder?: string;
  actions?: ReactNode;
  children?: ReactNode;
};

const MultiCriteriaSearch = ({
  value,
  onChange,
  criteria,
  placeholder = "Rechercher...",
  actions,
  children,
}: MultiCriteriaSearchProps) => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const displayedPlaceholder =
    isInputFocused && value.length === 0
      ? `Recherche dans : ${criteria.join(", ")}.`
      : placeholder;

  return (
    <section aria-label="Rechercher et filtrer la liste">
      <div className="flex w-full items-center gap-2">
        <label className="input input-bordered flex min-w-0 grow items-center gap-3 bg-base-100 focus-within:border-primary">
          <Search
            className="size-5 shrink-0 text-base-content/50"
            aria-hidden
          />
          <input
            className="min-w-0 grow"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            placeholder={displayedPlaceholder}
            aria-label={placeholder}
            autoComplete="off"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="btn btn-ghost btn-sm"
            >
              <X className="size-5" />
            </button>
          )}
        </label>
        {actions ? (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        ) : null}
      </div>

      {children ? <div className="mt-4">{children}</div> : null}
    </section>
  );
};

export default MultiCriteriaSearch;
