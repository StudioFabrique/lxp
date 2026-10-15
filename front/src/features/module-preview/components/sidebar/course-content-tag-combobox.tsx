import { useId, useMemo, useRef, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { ChevronDown } from "lucide-react";

import type Tag from "../../../../utils/interfaces/tag";
import { cn } from "../../../../utils/cn";

type Props = {
  tags: Tag[];
  /** Identifiant du tag choisi, `0` quand aucun tag n'est choisi. */
  value: number;
  onChange: (tagId: number) => void;
  disabled?: boolean;
};

const ALL_TAGS_ID = 0;

/** Recherche insensible à la casse et aux accents. */
const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim();

/** Champ de recherche de tag : on tape pour filtrer la liste, puis on choisit au clavier ou à la souris. */
export default function CourseContentTagCombobox({
  tags,
  value,
  onChange,
  disabled = false,
}: Props) {
  const listboxId = useId();
  const anchorRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const selectedTag = tags.find((tag) => tag.id === value);
  const options = useMemo(() => {
    const search = normalize(query);
    const matching = tags.filter((tag) =>
      normalize(tag.name).includes(search),
    );
    // « Tous les tags » n'est proposé que sans recherche en cours.
    return search === ""
      ? [{ id: ALL_TAGS_ID, name: "Tous les tags" }, ...matching]
      : matching;
  }, [tags, query]);
  const activeOption = options[Math.min(activeIndex, options.length - 1)];
  const optionId = (id: number) => `${listboxId}-${id}`;

  const open = () => {
    if (disabled || isOpen) return;
    setQuery("");
    setActiveIndex(
      Math.max(
        0,
        value === ALL_TAGS_ID ? 0 : tags.findIndex((tag) => tag.id === value) + 1,
      ),
    );
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setQuery("");
  };

  const choose = (tagId: number) => {
    onChange(tagId);
    close();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault();
        if (!isOpen) return open();
        const step = event.key === "ArrowDown" ? 1 : -1;
        setActiveIndex(
          (current) =>
            (Math.min(current, options.length - 1) + step + options.length) %
            Math.max(options.length, 1),
        );
        return;
      }
      case "Enter":
        if (isOpen && activeOption) {
          event.preventDefault();
          choose(activeOption.id);
        }
        return;
      case "Escape":
        if (isOpen) {
          event.preventDefault();
          event.stopPropagation();
          close();
        }
        return;
      case "Tab":
        close();
        return;
    }
  };

  const hasTags = tags.length > 0;

  return (
    <Popover.Root open={isOpen && hasTags} onOpenChange={(next) => !next && close()}>
      <Popover.Anchor asChild>
        <div ref={anchorRef} className="relative">
          <input
            type="text"
            role="combobox"
            aria-label="Rechercher un tag"
            aria-expanded={isOpen}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={
              isOpen && activeOption ? optionId(activeOption.id) : undefined
            }
            autoComplete="off"
            className="input input-sm input-bordered w-full pr-8"
            disabled={disabled || !hasTags}
            placeholder={
              !hasTags
                ? "Aucun tag disponible"
                : selectedTag?.name ?? "Choisir un tag"
            }
            value={isOpen ? query : (selectedTag?.name ?? "")}
            onFocus={open}
            onClick={open}
            onChange={(event) => {
              if (!isOpen) setIsOpen(true);
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <ChevronDown
            className={cn(
              "pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-base-content/60 transition-transform",
              isOpen && "rotate-180",
            )}
            aria-hidden="true"
          />
        </div>
      </Popover.Anchor>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={4}
          collisionPadding={12}
          className="z-[110] max-h-60 w-(--radix-popover-trigger-width) overflow-y-auto rounded-box border border-base-300 bg-base-100 p-1 shadow-xl"
          onOpenAutoFocus={(event) => event.preventDefault()}
          onCloseAutoFocus={(event) => event.preventDefault()}
          onInteractOutside={(event) => {
            // Un clic dans le champ ne doit pas refermer la liste.
            if (anchorRef.current?.contains(event.target as Node)) {
              event.preventDefault();
            }
          }}
        >
          <ul id={listboxId} role="listbox" aria-label="Tags">
            {options.length === 0 ? (
              <li className="px-3 py-2 text-sm text-base-content/60" role="presentation">
                Aucun tag trouvé.
              </li>
            ) : (
              options.map((option, index) => (
                <li
                  key={option.id}
                  id={optionId(option.id)}
                  role="option"
                  aria-selected={option.id === value}
                  className={cn(
                    "cursor-pointer rounded-field px-3 py-2 text-sm",
                    index === activeIndex && "bg-primary/15",
                    option.id === value && "font-semibold",
                  )}
                  // mousedown : le champ garde le focus pendant la sélection.
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => choose(option.id)}
                >
                  {option.name}
                </li>
              ))
            )}
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
