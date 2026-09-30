import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { hobbySchema, linkSchema } from "../../../../utils/validation/fields";
import { useFormField } from "../../../../components/form/useFormField";
import { Plus, X } from "lucide-react";
import type Hobby from "../../../user/interfaces/hobby";
import type { Link } from "../../../user/interfaces/link";
import { transformLink } from "../../../user/helpers/link-transform";
import LinkPreview from "./LinkPreview";

type Props = {
  hobbies: Hobby[];
  links: Link[];
  onHobbiesChange: (items: Hobby[]) => void;
  onLinksChange: (items: Link[]) => void;
};

export default function ProfileItemsEditor({
  hobbies,
  links,
  onHobbiesChange,
  onLinksChange,
}: Props) {
  const passionForm = useForm({
    resolver: zodResolver(hobbySchema),
    defaultValues: { title: "" },
  });
  const urlForm = useForm({
    resolver: zodResolver(linkSchema),
    defaultValues: { url: "", type: "website" as Link["type"] },
  });
  const [passion, setPassion] = useFormField(passionForm, "title");
  const [url, setUrl] = useFormField(urlForm, "url");
  const passionError = passionForm.formState.errors.title?.message;
  const urlError = urlForm.formState.errors.url?.message;
  const addPassion = passionForm.handleSubmit(({ title }) => {
    if (
      hobbies.some(
        (item) => item.title.toLocaleLowerCase() === title.toLocaleLowerCase(),
      )
    ) {
      passionForm.setError("title", {
        message: "Cette passion figure déjà dans la liste.",
      });
      return;
    }
    onHobbiesChange([...hobbies, { title }]);
    passionForm.reset();
  });
  const addLink = async () => {
    const normalized = transformLink(url.trim());
    urlForm.setValue("url", normalized.url);
    urlForm.setValue("type", normalized.type);
    await urlForm.handleSubmit((link) => {
      if (links.some((item) => item.url === link.url)) {
        urlForm.setError("url", {
          message: "Ce lien figure déjà dans la liste.",
        });
        return;
      }
      onLinksChange([...links, link]);
      urlForm.reset();
    })();
  };

  return (
    <div className="mt-6 grid gap-6 border-t border-base-300 pt-6 sm:grid-cols-2">
      <section className="space-y-3" aria-labelledby="passions-title">
        <div>
          <h3 id="passions-title" className="font-bold">
            Mes passions
          </h3>
          <p className="text-sm text-base-content/60">
            Partagez vos centres d’intérêt.
          </p>
        </div>
        <div className="join flex">
          <input
            className="input input-bordered join-item min-w-0 flex-1"
            value={passion}
            onChange={(event) => {
              setPassion(event.target.value);
              passionForm.clearErrors();
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addPassion();
              }
            }}
            placeholder="Ajouter une passion"
            aria-label="Nouvelle passion"
          />
          <button
            type="button"
            className="btn btn-primary join-item"
            onClick={addPassion}
            aria-label="Ajouter la passion"
          >
            <Plus className="size-4" />
          </button>
        </div>
        {passionError && (
          <p role="alert" className="text-sm text-error">
            {passionError}
          </p>
        )}
        <ul className="flex flex-wrap gap-2">
          {hobbies.map((item) => (
            <li
              key={item._id ?? item.title}
              className="flex min-h-12 items-center gap-1 rounded-lg border border-base-300 bg-base-200 px-3 py-2 text-sm"
            >
              <span>{item.title}</span>
              <button
                type="button"
                className="btn btn-ghost btn-xs btn-square"
                onClick={() =>
                  onHobbiesChange(
                    hobbies.filter((candidate) => candidate !== item),
                  )
                }
                aria-label={`Supprimer la passion ${item.title}`}
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section className="space-y-3" aria-labelledby="links-title">
        <div>
          <h3 id="links-title" className="font-bold">
            Mes liens
          </h3>
          <p className="text-sm text-base-content/60">
            Ajoutez vos profils ou sites web.
          </p>
        </div>
        <div className="join flex">
          <input
            className="input input-bordered join-item min-w-0 flex-1"
            type="url"
            value={url}
            onChange={(event) => {
              setUrl(event.target.value);
              urlForm.clearErrors();
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addLink();
              }
            }}
            placeholder="https://exemple.fr"
            aria-label="Nouveau lien"
          />
          <button
            type="button"
            className="btn btn-primary join-item"
            onClick={addLink}
            aria-label="Ajouter le lien"
          >
            <Plus className="size-4" />
          </button>
        </div>
        {urlError && (
          <p role="alert" className="text-sm text-error">
            {urlError}
          </p>
        )}
        <ul className="space-y-2">
          {links.map((item) => (
            <li
              key={item._id ?? item.url}
              className="flex min-h-12 items-center gap-2 rounded-lg border border-base-300 bg-base-200 px-3 py-2"
            >
              <LinkPreview link={item} />
              <button
                type="button"
                className="btn btn-ghost btn-xs btn-square ml-auto shrink-0"
                onClick={() =>
                  onLinksChange(links.filter((candidate) => candidate !== item))
                }
                aria-label={`Supprimer le lien ${item.url}`}
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
