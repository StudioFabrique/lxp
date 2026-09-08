import type { ReactNode } from "react";
import { Search, X } from "lucide-react";

type MultiCriteriaSearchProps = {
  value: string;
  onChange: (value: string) => void;
  criteria: string[];
  placeholder?: string;
  children?: ReactNode;
};

const MultiCriteriaSearch = ({
  value,
  onChange,
  criteria,
  placeholder = "Rechercher...",
  children,
}: MultiCriteriaSearchProps) => {
  const helpId = `search-help-${criteria.join("-").replace(/\s+/g, "-")}`;

  return (
    <section aria-label="Rechercher et filtrer la liste">
      <label className="input input-bordered input-lg flex w-full items-center gap-3 bg-base-100 focus-within:border-primary">
        <Search className="size-5 shrink-0 text-base-content/50" aria-hidden />
        <input
          type="search"
          className="min-w-0 grow"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          aria-describedby={helpId}
          autoComplete="off"
        />
        {value ? (
          <button
            type="button"
            className="btn btn-circle btn-ghost btn-sm"
            onClick={() => onChange("")}
            aria-label="Effacer la recherche"
          >
            <X className="size-4" aria-hidden />
          </button>
        ) : null}
      </label>

      <p id={helpId} className="mt-2 text-xs text-base-content/60">
        Recherche dans : {criteria.join(", ")}.
      </p>

      {children ? (
        <div className="mt-4">{children}</div>
      ) : null}
    </section>
  );
};

export default MultiCriteriaSearch;
