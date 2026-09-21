import { useState } from "react";
import { Plus, X } from "lucide-react";
import type Hobby from "../../../user/interfaces/hobby";
import type { Link } from "../../../user/interfaces/link";
import { transformLink, urlIsValid } from "../../../user/helpers/link-transform";
import LinkPreview from "./LinkPreview";

type Props = {
  hobbies: Hobby[];
  links: Link[];
  onHobbiesChange: (items: Hobby[]) => void;
  onLinksChange: (items: Link[]) => void;
};

export default function ProfileItemsEditor({ hobbies, links, onHobbiesChange, onLinksChange }: Props) {
  const [passion, setPassion] = useState("");
  const [url, setUrl] = useState("");
  const [passionError, setPassionError] = useState("");
  const [urlError, setUrlError] = useState("");

  const addPassion = () => {
    const title = passion.trim();
    if (!title) return setPassionError("Saisissez une passion.");
    if (hobbies.some((item) => item.title.toLocaleLowerCase() === title.toLocaleLowerCase())) return setPassionError("Cette passion figure déjà dans la liste.");
    onHobbiesChange([...hobbies, { title }]);
    setPassion("");
    setPassionError("");
  };
  const addLink = () => {
    const value = url.trim();
    if (!value || !urlIsValid(value) || /^[a-z][a-z\d+.-]*:\/\//i.test(value) && !/^https?:\/\//i.test(value)) return setUrlError("Saisissez une adresse web valide.");
    const link = transformLink(value);
    if (!/^https?:\/\//i.test(link.url)) return setUrlError("Saisissez une adresse web valide.");
    if (links.some((item) => item.url === link.url)) return setUrlError("Ce lien figure déjà dans la liste.");
    onLinksChange([...links, link]);
    setUrl("");
    setUrlError("");
  };

  return <div className="mt-6 grid gap-6 border-t border-base-300 pt-6 sm:grid-cols-2">
    <section className="space-y-3" aria-labelledby="passions-title">
      <div><h3 id="passions-title" className="font-bold">Mes passions</h3><p className="text-sm text-base-content/60">Partagez vos centres d’intérêt.</p></div>
      <div className="join flex"><input className="input input-bordered join-item min-w-0 flex-1" value={passion} onChange={(event) => { setPassion(event.target.value); setPassionError(""); }} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addPassion(); } }} placeholder="Ajouter une passion" aria-label="Nouvelle passion" /><button type="button" className="btn btn-primary join-item" onClick={addPassion} aria-label="Ajouter la passion"><Plus className="size-4" /></button></div>
      {passionError && <p role="alert" className="text-sm text-error">{passionError}</p>}
      <ul className="flex flex-wrap gap-2">{hobbies.map((item) => <li key={item._id ?? item.title} className="flex min-h-12 items-center gap-1 rounded-lg border border-base-300 bg-base-200 px-3 py-2 text-sm"><span>{item.title}</span><button type="button" className="btn btn-ghost btn-xs btn-square" onClick={() => onHobbiesChange(hobbies.filter((candidate) => candidate !== item))} aria-label={`Supprimer la passion ${item.title}`}><X className="size-4" /></button></li>)}</ul>
    </section>
    <section className="space-y-3" aria-labelledby="links-title">
      <div><h3 id="links-title" className="font-bold">Mes liens</h3><p className="text-sm text-base-content/60">Ajoutez vos profils ou sites web.</p></div>
      <div className="join flex"><input className="input input-bordered join-item min-w-0 flex-1" type="url" value={url} onChange={(event) => { setUrl(event.target.value); setUrlError(""); }} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addLink(); } }} placeholder="https://exemple.fr" aria-label="Nouveau lien" /><button type="button" className="btn btn-primary join-item" onClick={addLink} aria-label="Ajouter le lien"><Plus className="size-4" /></button></div>
      {urlError && <p role="alert" className="text-sm text-error">{urlError}</p>}
      <ul className="space-y-2">{links.map((item) => <li key={item._id ?? item.url} className="flex min-h-12 items-center gap-2 rounded-lg border border-base-300 bg-base-200 px-3 py-2"><LinkPreview link={item} /><button type="button" className="btn btn-ghost btn-xs btn-square ml-auto shrink-0" onClick={() => onLinksChange(links.filter((candidate) => candidate !== item))} aria-label={`Supprimer le lien ${item.url}`}><X className="size-4" /></button></li>)}</ul>
    </section>
  </div>;
}
