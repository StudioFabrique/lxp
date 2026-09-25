import type { PropsWithChildren, ReactNode } from "react";

type Props = PropsWithChildren<{
  title: ReactNode;
  titleAccessory?: ReactNode;
  description?: ReactNode;
  variant?: "default" | "setup";
}>;

/**
 * Structure commune aux écrans publics d'authentification.
 *
 * La zone de titre garde la même hauteur sur toutes les pages, y compris
 * lorsqu'un intitulé passe sur plusieurs lignes.
 */
const AuthPageWrapper = ({
  title,
  titleAccessory,
  description,
  variant = "default",
  children,
}: Props) => {
  if (variant === "setup") {
    return (
      <section className="flex min-h-full w-full flex-col">
        <header className="mb-7 text-center">
          <div className="flex items-start justify-center gap-2">
            <h1 className="text-2xl font-bold leading-tight text-base-content">
              {title}
            </h1>
            {titleAccessory}
          </div>
          {description && (
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-base-content/65">
              {description}
            </p>
          )}
        </header>
        {children}
      </section>
    );
  }

  return (
    <section className="flex w-full flex-col my-10">
      <header className="text-center mb-5">
        <div className="flex items-start justify-center gap-2">
          <h1 className="text-2xl font-bold leading-tight text-base-content">
            {title}
          </h1>
          {titleAccessory}
        </div>
        {description && (
          <p className="mt-5 text-sm text-base-content/70">{description}</p>
        )}
      </header>

      {children}
    </section>
  );
};

export default AuthPageWrapper;
