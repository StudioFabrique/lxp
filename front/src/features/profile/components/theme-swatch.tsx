export const ThemeSwatch = ({ theme }: { theme: string }) => (
  <span
    data-theme={theme}
    className="flex size-5 shrink-0 overflow-hidden rounded-full ring-1 ring-base-content/20"
    aria-hidden="true"
  >
    <span className="h-full w-1/2 bg-primary" />
    <span className="h-full w-1/2 bg-secondary" />
  </span>
);
