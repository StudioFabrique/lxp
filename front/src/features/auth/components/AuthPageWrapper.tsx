import type { PropsWithChildren, ReactNode } from "react";

type Props = PropsWithChildren<{
  title: ReactNode;
  description?: ReactNode;
}>;

/**
 * Structure commune aux écrans publics d'authentification.
 *
 * La zone de titre garde la même hauteur sur toutes les pages, y compris
 * lorsqu'un intitulé passe sur plusieurs lignes.
 */
const AuthPageWrapper = ({ title, description, children }: Props) => {
  return (
    <section className="flex w-full flex-col mt-10">
      <header className="mb-6 text-center">
        <div className="flex h-24 items-start justify-center">
          <h1 className="text-2xl font-bold leading-tight text-base-content">
            {title}
          </h1>
        </div>
        {description && (
          <p className="mt-2 text-sm text-base-content/70">{description}</p>
        )}
      </header>

      {children}
    </section>
  );
};

export default AuthPageWrapper;
