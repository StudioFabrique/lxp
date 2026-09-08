import type { ReactNode } from "react";
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
  const helpId = `search-help-${criteria.join("-").replace(/\s+/g, "-")}`;

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
            placeholder={placeholder}
            aria-label={placeholder}
            aria-describedby={helpId}
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

      <p id={helpId} className="mt-2 text-xs text-base-content/60">
        Recherche dans : {criteria.join(", ")}.
      </p>

      {children ? <div className="mt-4">{children}</div> : null}
    </section>
  );
};

export default MultiCriteriaSearch;
